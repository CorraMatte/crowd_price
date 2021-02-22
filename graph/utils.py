from profiles.models import Analyst
from rest_framework import status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist


def check_user_is_analyst(function):
    def _function(request, *args, **kwargs):
        try:
            r = args[0]
            Analyst.objects.get(profile__user=r.user.pk)
            return function(request, *args, **kwargs)
        except ObjectDoesNotExist:
            return Response({'detail': 'user not allowed'}, status.HTTP_403_FORBIDDEN)
    return _function


def get_serial_response_by_name(res):
    serial_res = []

    for r in res:
        serial_res.append({"name": r.name, "value": r.count})

    return Response({'results': serial_res}, status.HTTP_200_OK)