import React from "react";
import NearestReports from "../components/report/NearestReports";
import NewerReports from "../components/report/NewerReports";
import MostReportedProducts from "../components/product/MostReportedProducts";
import SavedSearch from "../components/search/SavedSearch";
import RecentSearch from "../components/search/RecentSearch";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";


class Home extends React.Component {
    render() {
        console.log(isLoggedIn());

        let only_log_features;
        if (isLoggedIn()) {
            only_log_features = [<SavedSearch />, <RecentSearch />, <NearestReports />,];
        }
        return (
            <div>
                {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
                {only_log_features}
                <MostReportedProducts />
                <NewerReports />
            </div>
        );
    };
}

export default Home;