import React, {Component} from 'react';
import {InputNumber, Select} from 'antd';
const Option = Select.Option;
import './App.css';
import {fmoney, cut2} from './lib/Utils';

class App extends Component {
    state = {
        area: 78,//面积
        price: 10000,//每平米价格
        percent: 7,//按揭成数
        tax: 1,//契税
        repair: 90,//专项维修资金
        sellYear: 2,//几年后出售

        loanType: '0',//贷款形式 0商贷 1公积金
        loanYear: 20,//贷款年限
        rate: 5.39,//利率
        paybackType: '0',//还款方式 0等额本息 1等额本金
        propertyCharges: 2.0,//物业费

        total: 0,//房屋总价
        firstPay: 0,//首付款
        borrow: 0,//一共借了多少钱
        monthRate: 0,//月利率
        totalMonth: 0,//一共多少个月
        monthPay: 0,//每个月还多少钱，
        totalPay: 0,//一共需要还多少钱
        totalTax: 0,//契税
        totalRepair: 0,//专项维修资金
        totalFirstPay: 0,//第一次缴纳的全部费用
        totalPayWhenSell: 0,//出售时，总共付了多少钱
        paybackWhenSell: 0,//出售时，总共还了多少钱
        propertyChargesWhenSell:0,//出售时,总共支付的物业费

    }

    componentDidMount() {
        // console.log(1121)
        this.onChagneValue('area', 100)
    }

    onChagneValue(type, value) {
        console.log('change:', type, value)
        var obj = this.state;
        obj[type] = value;
        if (type === 'loanType') {
            if (value === '0') {
                obj['rate'] = 5.39;//商贷
            } else {
                obj['rate'] = 3.25;//公积金
            }
        }
        var total = obj.price * obj.area;
        var borrow = total * obj.percent / 10;
        var monthRate = obj.rate / 12 / 100;
        var totalMonth = obj.loanYear * 12;
        var totalTax = total * obj.tax / 100;
        var totalRepair = obj.repair * obj.area;
        var propertyChargesWhenSell = obj.propertyCharges*obj.sellYear * 12*obj.area;
        if (obj.paybackType == '0') {//0等额本息
            var monthPay = borrow * monthRate * Math.pow(1 + monthRate, totalMonth) / (Math.pow(1 + monthRate, totalMonth) - 1);//
            var totalPay = monthPay * totalMonth;
            var paybackWhenSell = obj.sellYear * 12 * monthPay;

        } else {//1等额本金
            var arrMonthPay = [];
            monthPay = '每月额度不固定';
            totalPay = 0;
            paybackWhenSell=0;
            var totalBenjin = 0;
            // totalMonth
            for (var i = 0; i < totalMonth; i++) {
                var _mpay = borrow / totalMonth + (borrow - totalBenjin) * monthRate;
                _mpay = Math.round(_mpay * 100) / 100;
                totalBenjin = (borrow / totalMonth) * (i + 1);
                arrMonthPay.push(_mpay);
                totalPay += _mpay;
            }
            for (i = 0; i < obj.sellYear * 12; i++) {
                paybackWhenSell += arrMonthPay[i];
            }
            // console.log(111, paybackWhenSell)
        }

        obj.total = total;
        obj.borrow = borrow;
        obj.firstPay = total - borrow;
        obj.totalPay = totalPay;
        obj.monthRate = monthRate;
        obj.totalMonth = totalMonth;
        obj.monthPay = monthPay;
        obj.totalTax = totalTax;
        obj.totalRepair = totalRepair;
        obj.totalFirstPay = obj.firstPay + totalTax + totalRepair + 10 + 5 + 80;
        obj.paybackWhenSell = paybackWhenSell;
        obj.propertyChargesWhenSell = propertyChargesWhenSell;


        obj.totalPayWhenSell = obj.totalFirstPay + paybackWhenSell+propertyChargesWhenSell;

        // console.log(21321,obj.monthRate)
        this.setState(obj);
    }

    firstPay() {//第一次要付的款
        const {firstPay, totalTax, totalRepair, totalFirstPay} = this.state;
        return <div className="area">
            <div className="header">{`首付款合计: ${fmoney(totalFirstPay)}`}</div>
            <div>
                {`首付款:${fmoney(firstPay, 0)} 专项维修资金:${fmoney(totalRepair, 0)} 契税:${fmoney(totalTax)} 产权登记费:80 印花税:10 工本费:5`}
            </div>
        </div>
    }

    sell() {//出售
        const {totalPayWhenSell, firstPay, paybackWhenSell, sellYear,propertyChargesWhenSell} = this.state;
        return <div className="area">
            <div className="header">{`2年后总支出: ${fmoney(totalPayWhenSell)}`}</div>
            <div>
                {`首付款合计:${fmoney(firstPay, 0)} 还款${sellYear * 12}个月总计:${fmoney(paybackWhenSell, 2)} 物业费:${propertyChargesWhenSell}`}
            </div>
        </div>
    }

    render() {
        console.log(this.state)
        const {total, borrow, firstPay, totalMonth, monthPay, totalPay} = this.state;
        return (
            <div className="App">
                <div className="area">
                    <div className="line">
                        <div className="inLine contentOut">
                            <div className="contentIn">面积</div>
                            <InputNumber min={0}  step={0.01} formatter={value => `${value}平`} style={{width: 100}}
                                         value={this.state.area}
                                         onChange={this.onChagneValue.bind(this, 'area')}/>
                        </div>
                        <div className="inLine contentOut">
                            <div className="contentIn">平米价格</div>
                            <InputNumber min={0} formatter={value => `${value}元`} step={50}
                                         defaultValue={this.state.price}
                                         onChange={this.onChagneValue.bind(this, 'price')}/>
                        </div>
                        <div className="inLine contentOut">
                            <div className="contentIn">按揭</div>
                            <InputNumber min={1} max={9} formatter={value => `${value}成`} style={{width: 60}}
                                         defaultValue={this.state.percent}
                                         onChange={this.onChagneValue.bind(this, 'percent')}/>
                        </div>

                    </div>
                    <div className="clear"/>
                    <div className="line">
                        <div className="inLine contentOut">
                            <Select defaultValue="0" style={{width: 100}}
                                    onChange={this.onChagneValue.bind(this, 'loanType')}>
                                <Option value="0">商业贷款</Option>
                                <Option value="1">公积金贷款</Option>
                            </Select>
                            <InputNumber min={0} formatter={value => `${value}年`} style={{width: 60}}
                                         defaultValue={this.state.loanYear}
                                         onChange={this.onChagneValue.bind(this, 'loanYear')}/>
                        </div>

                        <div className="inLine contentOut">
                            <div className="contentIn">利率</div>
                            <InputNumber min={0} step={0.01} formatter={value => `${value}%`} value={this.state.rate}
                                         onChange={this.onChagneValue.bind(this, 'rate')}/>
                        </div>
                        <Select value={this.state.paybackType} style={{width: 100}}
                                onChange={this.onChagneValue.bind(this, 'paybackType')}>
                            <Option value="0">等额本息</Option>
                            <Option value="1">等额本金</Option>
                        </Select>
                    </div>
                    <div className="clear"/>
                    <div className="line">
                        <div className="inLine contentOut">
                            <div className="contentIn">契税</div>
                            <InputNumber min={0} step={0.1} formatter={value => `${value}%`} style={{width: 60}}
                                         value={this.state.tax}
                                         onChange={this.onChagneValue.bind(this, 'tax')}/>
                        </div>
                        <div className="inLine contentOut">
                            <div className="contentIn">专项维修资金</div>
                            <InputNumber min={0} formatter={value => `${value}/平`} style={{width: 60}}
                                         value={this.state.repair}
                                         onChange={this.onChagneValue.bind(this, 'repair')}/>
                        </div>
                        <div className="inLine contentOut">
                            <div className="contentIn">物业费</div>
                            <InputNumber min={0} step={0.1} formatter={value => `${value}元`} style={{width: 60}}
                                         defaultValue={this.state.propertyCharges}
                                         onChange={this.onChagneValue.bind(this, 'propertyCharges')}/>
                        </div>
                    </div>
                    <div className="clear"/>
                    <div className="line">
                        <div className="inLine contentOut">
                            <InputNumber className="contentIn" min={0} formatter={value => `${value}`}
                                         style={{width: 40}}
                                         value={this.state.sellYear}
                                         onChange={this.onChagneValue.bind(this, 'sellYear')}/>
                            <div className="contentIn">年后出售</div>
                        </div>
                    </div>
                    <div className="clear"/>
                </div>
                {this.firstPay()}

                <div className="area">
                    <div className="header">{`月均还款: ${fmoney(monthPay, 2)} `}</div>
                    <div>
                        {`房款总额:${fmoney(total, 0)} 首期付款:${fmoney(firstPay, 0)}  贷款总额:${fmoney(borrow, 0)} `}
                    </div>
                    <div>
                        {`共还款${totalMonth}期 还款总额${fmoney(cut2(totalPay), 2)} 支付利息款:${fmoney(totalPay - borrow, 2)}`}
                    </div>
                </div>
                {this.sell()}
            </div>
        );
    }
}

export default App;
