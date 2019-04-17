/**
 * Created by ICOP on 2019-04-15.
 */
var React = require('react');
var {YYClass} = require('yylib-ui');
var assign = require('lodash/assign');
var {YYCreatePage} =  require('yylib-business');
var {CardEventHandler} = require('yylib-cscec');
var EquipmentTenderApplicationUrl = require('./EquipmentTenderApplicationUrl');
var AuthToken = require('yylib-utils/AuthToken');  //引入AuthToken
var page;

//页面初始化
var EventHandler = {

    "cardPage": {
        onViewWillMount: function (options) {
            debugger;
            let page=this;
            CardEventHandler.pageLoading(this);
            page.findUI()
        }
        , onViewDidMount: function (options) {
            CardEventHandler.init(this, EquipmentTenderApplicationUrl);
            var params = this.getRouteQuery();
            if (params && params.id) {

            } else {
                // 新增时,单位信息赋值
                var context = AuthToken.getContext();//
                var form1 = this.findUI("baseForm");//找到

                form1.api.setFieldsValue({
                    'companyId': context.companyId,
                    'companyName': {'id': context.companyId, 'name': context.companyName},
                    'responsibilityUnit': context.companyName,
                    'myName':num
                });
            }
        }
        , onViewWillUpdate: function (options) {

        }
        , onViewDidUpdate: function (options) {

        }
    }
};

var EquipmentTenderApplicationCardPage = YYClass.create({
    render: function () {
        return <YYCreatePage {...this.props} appCode="A002059" pageCode="P011092"

                                             uiEvent={assign({},CardEventHandler.API,EventHandler)} 
                                       />
    }
});

module.exports = EquipmentTenderApplicationCardPage;