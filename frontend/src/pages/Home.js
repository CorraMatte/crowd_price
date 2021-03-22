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
        let only_log_features;
        if (isLoggedIn()) {
            only_log_features =
                <div>
                    <SavedSearch />
                    <RecentSearch />
                    <NearestReports />
                </div>
        }
        return (
            <div>
                {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
                <MostReportedProducts />
                <NewerReports />
                {only_log_features}
            </div>
        );
    };
}

export default Home;