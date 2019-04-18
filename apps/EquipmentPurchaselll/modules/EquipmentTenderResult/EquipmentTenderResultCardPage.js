/**
 * Created by ICOP on 2019-04-15.
 */
var React = require('react');
var {YYClass} = require('yylib-ui');
var assign = require('lodash/assign');
var {YYCreatePage} =  require('yylib-business');
var {CardEventHandler} = require('yylib-cscec');
var EquipmentTenderResultUrl = require('./EquipmentTenderResultUrl');
var AuthToken = require('yylib-utils/AuthToken');  //引入AuthToken
var showTenderRef=false;  // 中标单位显示标志位
var {YYClass, YYMessage, YYPage, YYReferDialog} = require('yylib-ui');
let page=null;

//页面初始化
var EventHandler = {

    //中标单位选择 - 点击添加
    "bidderAdd": {

        onClick: function onClick(obj) {
            showTenderRef = true;
            page.refresh();

        }
    },
    //减行时调用求和方法
    "deleteRow1": {
        onClick: function (obj) {
            CardEventHandler.delRow(page, 'listTable');
            calculateTotal() ;

        }
    },


    //中标单位选择 - 减行按钮
    "deleteRow2": {
        onClick: function (obj) {
            CardEventHandler.delRow(page, 'companyTable');

        }
    },
    "tenderName": {
        "onShow": function (options) {

            page.findUI("tenderName").condition = {
                companyId: AuthToken.getOrgaId(),
            }
            this.refresh();
        },
        "onChange": function (value, column, data) {
            //当tenderName这个键值发生变化onChange时，把参照信息（ID CODE NAME）带入，其他字段可以通过映射配置
            page.findUI('baseForm').api.setFieldsValue({  //表单赋值
               'tenderName': {id:data.id, name: data.tenantId, code: data.billCode},
                'tenderMethod':tenderMethodHanhua(data.tenderMethod),


            })
            //定义一个求和，当tenderName这个键值发生变化onChange时，把子表信息带入表单子表设备清单中
            var total=null;
            data.editTable.forEach(function (item) {
                item.rowState = "add";
                total+=item.number*item.unitPrice;

            })

            page.findUI('listTable').dataSource= data.editTable;
            page.findUI("baseForm").api.setFieldsValue({totalMoney:total});
            page.refresh();
        }
    },



    "cardPage": {
        onViewWillMount: function (options) {
            page = this;// 初始化页面对象
            CardEventHandler.pageLoading(this);

        }
        , onViewDidMount: function (options) {
            CardEventHandler.init(this, EquipmentTenderResultUrl);//加载自带组件
            page.findUI('baseForm').api.setFieldsValue({ 'tenderData': new Date()});//获取当前时间
        }
        , onViewWillUpdate: function (options) {

        }
        , onViewDidUpdate: function (options) {

        }
    }
};

//自定义页面渲染方法，解析招标方式为对应汉字
function tenderMethodHanhua(a) {
    if (a == "openTender") {
        return "公开招标";
    }
    else if (a == "InvitationTender") {
        return "邀请招标";
    }
    else if (a == "negotiation") {
        return "竞争性谈判"
    }
    else {
        return null;
    }
}

//减行时求和方法//
function calculateTotal() {
    var listTable = page.findUI('listTable');
    var dataSource = listTable.api.getDataSource();
    var total = 0;
    dataSource.forEach(function (item) {
        total+=item.number*item.unitPrice;
    });
    page.findUI('baseForm').api.setFieldsValue({'totalMoney': total == 0 ? '' : total});
}



var onCancel = function () {

    showTenderRef = false;
    page.refresh();
}

var onOk = function (shortValue, filedValue, fullValue) {//

    var companyTable = page.findUI('companyTable');
    var dataSource = companyTable.api.getDataSource();

    if (fullValue.length > 0) {//整行数据
        for (var i = 0; i < fullValue.length; i++) {
            var row = {
                // isEdit:true,
                id: YYClass.uuid32(),
                billCode: fullValue[i].billCode,
                legalName: fullValue[i].legalName,
                registeredCapital: fullValue[i].registerMoney,
                legalPhone: fullValue[i].officeTel,
                deliveryUnit:fullValue[i].supplier,
                rowState: "add"
            };
            dataSource.push(row);
        }
    }
    //已有数据赋值
    companyTable.dataSource = dataSource;
    showTenderRef = false;
    page.refresh();
}
/**
 * 中标单位弹出参照
 */
var tenderBidderForm = React.createClass({   //对应解析器键值
    render: function () {
        return showTenderRef ? (<YYReferDialog
            serverUrl={EquipmentTenderResultUrl.REF_SERVER_URL}
            show={showTenderRef}
            onCancel={onCancel}
            onOk={onOk}
            condition={{orgId: AuthToken.getContext().companyId}}
            often={false}
            multiselect={true}
            refinfokey='bd-012'/>) : null;
    }
});


var myParser = {};
myParser.subcontractingUnit = tenderBidderForm;

var EquipmentTenderResultCardPage = YYClass.create({
    render: function () {
        return <YYCreatePage {...this.props} appCode="A002059" pageCode="P011148"
                                             uiEvent={assign({},CardEventHandler.API,EventHandler)}
                             uiParser={myParser}  />
    }
});

module.exports = EquipmentTenderResultCardPage;