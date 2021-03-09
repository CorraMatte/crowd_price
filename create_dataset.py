from argparse import ArgumentParser
from datetime import timedelta

import django

django.setup()

import random
from capabilities.models import *
from profiles.models import *
from pytz import timezone

categories = {
    'food': Category(name='food'),
    'beverage': Category(name='beverage'),
    'clothes': Category(name='clothes'),
    'smartphone': Category(name='smartphone'),
    'furniture': Category(name='furniture'),
}

products = {
    'food': [Product(name='Gocciole Pavesi'), Product(name='Salame Golfetta'),
             Product(name='Prosciutto cotto Ferrarini'), Product(name='Prosciutto crudo di Parma')],
    'beverage': [Product(name='Coca Cola 1.5L'), Product(name='Milk 1L'), Product(name='Water 1L'),
                 Product(name='Cola Cola 0.33')],
    'clothes': [Product(name='Underwear'), Product(name='Socks'), Product(name='T-Shirt'), Product(name='Jeans')],
    'smartphone': [Product(name='Samsung Galaxy A10'), Product(name='Samsung Galaxy A9'), Product(name='iPhone 11 Pro'),
                   Product(name='Oppo A52S')],
    'furniture': [Product(name='Desk'), Product(name='Office chair with wheels'), Product(name='Simple chair'),
                  Product(name='Bedside table')],
}

reports = {
    "Bedside table": [5, 150],
    "Coca Cola 1.5L": [0.5, 2],
    "Cola Cola 0.33": [0.2, 1],
    "Desk": [15, 400],
    "Gocciole Pavesi": [0.5, 3.5],
    "iPhone 11 Pro": [299, 1999],
    "Jeans": [5, 500],
    "Milk 1L": [0.5, 2],
    "Office chair with wheels": [20, 350],
    "Oppo A52S": [59, 399],
    "Prosciutto cotto Ferrarini 1h": [0.5, 4.5],
    "Prosciutto crudo di Parma 1h": [0.5, 4.5],
    "Salame Golfetta": [0.2, 4],
    "Samsung Galaxy A10": [59, 299],
    "Samsung Galaxy A9": [39, 199],
    "Simple chair": [10, 100],
    "Socks": [0.5, 20],
    "T-Shirt": [2, 10],
    "Underwear": [0.5, 5],
    "Water 1L": [0.05, 1]
}


def random_date(start, end):
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)


    return timezone('Europe/Rome').localize(start + timedelta(seconds=random_second))


def create_report():
    consumers = Consumer.objects.all()
    stores = Store.objects.all()
    latitude = 44.6938136
    longitude = 10.6102741
    now = datetime.datetime.now()
    one_month_ago = now - timedelta(days=365)

    for i in range(1000):
        prod = random.choice(list(reports.items()))

        if random.randint(1, 2) % 2 == 0:
            s = stores[random.randint(0, len(stores) - 1)]
            r = Report(
                product=Product.objects.get(name=prod[0]),
                price=random.uniform(prod[1][0], prod[1][1]),
                consumer=consumers[random.randint(0, len(consumers) - 1)],
                store=s,
                pnt=s.pnt,
                created_time=random_date(one_month_ago, now)
            )
        else:
            report_lon = longitude + random.uniform(-0.2, 0.2)
            report_lat = latitude + random.uniform(-0.2, 0.2)

            r = Report(
                product=Product.objects.get(name=prod[0]),
                price=random.uniform(prod[1][0], prod[1][1]),
                consumer=consumers[random.randint(0, len(consumers) - 1)],
                pnt=f'POINT({report_lon} {report_lat})',
                created_time=random_date(one_month_ago, now)
            )

        r.save()


def create_all():
    for c in categories.values():
        c.save()

    for c, prods in products.items():
        for p in prods:
            p.save()
            p.categories.set([Category.objects.get(name=c)])

    create_report()


def main():
    parse = ArgumentParser()
    parse.add_argument('-a', '--all', action='store_true', help='create all the dataset incluse products and category')
    parse.add_argument('-r', '--report', action='store_true', help='create only the report for the existing products')
    args = parse.parse_args()

    if args.all:
        create_all()
    elif args.report:
        create_report()


if __name__ == '__main__':
    main()
