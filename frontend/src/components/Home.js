import React from "react";
import NearestReports from "./report/NearestReports";
import NewerReports from "./report/NewerReports";
import MostReportedProducts from "./MostReportedProducts";
import SavedSearch from "./search/SavedSearch";
import RecentSerch from "./search/RecentSearch";


class Home extends React.Component {
    render() {
        let only_log_features;
        if (this.props.isAuthenticated) {
            only_log_features = [<SavedSearch/>, <RecentSerch/>, <NearestReports />,]
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