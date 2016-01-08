
// React js component
var React = require('react');

var customeAlert = React.createClass({

    getInitialState: function() {
        return {};
    },
    render: function() {

        if(this.props.selectedPage){
            var selectedPage = this.props.selectedPage;

            return  <div className={this.props.alertType}>
                        <span>
                            {selectedPage.selectInPage}&nbsp;
                            {selectedPage.action}&nbsp;
                            instances selected. &nbsp;
                        </span>
                        <span className="frm-link"
                                onClick={selectedPage.onClick}>
                            Select all&nbsp;
                            {selectedPage.selectInAllPages}&nbsp;
                            {selectedPage.action}&nbsp;
                            instances
                        </span>
                    </div>
        }else{
            if(this.props.selectedAll){
                var selectedAll = this.props.selectedAll;
                return  <div className={this.props.alertType}>
                            <span>
                                {selectedAll.selectInAllPages}&nbsp;
                                instances selected.&nbsp;
                            </span>
                            <span className="frm-link"
                                onClick={selectedAll.onClick}>
                                Clear selection
                            </span>
                          </div>
            }else{
                return  <div className={this.props.alertType}>
                            {this.props.message}
                        </div>
            }
        }
   }
});

module.exports = customeAlert;
