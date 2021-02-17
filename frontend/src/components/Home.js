import React from "react";
import NearestReports from "./report/NearestReports";
import NewerReports from "./report/NewerReports";
import MostReportedProducts from "./product/MostReportedProducts";
import SavedSearch from "./search/SavedSearch";
import RecentSearch from "./search/RecentSearch";
import {isLoggedIn} from "../auth";


class Home extends React.Component {
    render() {
        let only_log_features;
        if (isLoggedIn()) {
            only_log_features = [<SavedSearch />, <RecentSearch />, <NearestReports />,];
        }
        return (
            <div>
                {only_log_features}
                <MostReportedProducts />
                <NewerReports />
            </div>
        );
    };
}

export default Home;