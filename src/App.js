import React, {Component} from 'react';
import {InputNumber, Select} from 'antd';
const Option = Select.Option;
import './App.css';
import {fmoney, cut2} from './lib/Utils';

class App extends Component {
    state = {
        area: 79,//面积
        price: 14000,//每平米价格
        percent: 6,//按揭成数
        tax: 1,//契税
        repair: 30,//专项维修资金
        sellYear: 6,//几年后出售
        zhongjie: 2.7,//中介费+保障服务费 2.7%
        zhongjieTotal: 0,//中介费的总额

        loanType: '0',//贷款形式 0商贷 1公积金
        loanYear: 20,//贷款年限
        rate: 5.39,//利率
        paybackType: '1',//还款方式 0等额本息 1等额本金
        propertyCharges: 2.6,//物业费

        total: 0,//房屋总价
        firstPay: 0,//首付款
        borrow: 0,//一共借了多少钱
        monthRate: 0,//月利率
        totalMonth: 0,//一共多少个月
        monthPay: 0,//等额本息 每个月还多少钱，
        arrMonthPay: [],//等额本金 每个月还多少钱，
        totalPay: 0,//一共需要还多少钱
        totalTax: 0,//契税
        totalRepair: 0,//专项维修资金
        totalFirstPay: 0,//第一次缴纳的全部费用
        totalPayWhenSell: 0,//出售时，总共付了多少钱
        paybackWhenSell: 0,//出售时，总共还了多少钱
        propertyChargesWhenSell: 0,//出售时,总共支付的物业费
        needPayWhenSell: 0,//出售时，还需要付银行多少钱
        benjinWhenSell: 0,//出售时，已经支付了多少本金
        lixiWhenSell: 0,//出售时，已经支付了多少利息
        basePrice: 0,//每平米售价为多少时，不陪钱
        sellPrice: 0,//出售的每平米价格
        earnMoney: 0,//出售后能挣钱多少钱
    }

    componentDidMount() {
        // console.log(1121)
        this.onChagneValue('loanType', "0")
    }

    onChagneValue(type, value) {
        // console.log('change:', type, value)
        var obj = this.state;
        obj[type] = value;
        if (type === 'loanType') {
            if (value === '0') {
                obj['rate'] = 5.39;//商贷
            } else {
                obj['rate'] = 3.25;//公积金
            }
        }
        if (obj.area < 0) obj.area = 0;

        var total = obj.price * obj.area;
        var borrow = total * obj.percent / 10;
        var monthRate = obj.rate / 12 / 100;
        var totalMonth = obj.loanYear * 12;
        var totalTax = total * obj.tax / 100;
        var totalRepair = obj.repair * obj.area;
        var propertyChargesWhenSell = obj.propertyCharges * obj.sellYear * 12 * obj.area;//物业、费用
        var numPayMonth = obj.sellYear * 12;//换了多少个月的钱
        var benjinWhenSell = 0;
        var lixiWhenSell = 0;


        if (obj.paybackType === '0') {//0等额本息
            var monthPay = borrow * monthRate * Math.pow(1 + monthRate, totalMonth) / (Math.pow(1 + monthRate, totalMonth) - 1);//
            var totalPay = monthPay * totalMonth;
            var paybackWhenSell = obj.sellYear * 12 * monthPay;
            var arrLixi = [];//每个月的利息
            var arrBenjin = [];//每个月的本金
            for (var i = 0; i < totalMonth; i++) {
                var _lixi = borrow * monthRate * (Math.pow(1 + monthRate, totalMonth) - Math.pow(1 + monthRate, i)) / (Math.pow(1 + monthRate, totalMonth) - 1);
                arrLixi.push(_lixi);

                var _benjin = borrow * monthRate * Math.pow(1 + monthRate, i) / (Math.pow(1 + monthRate, totalMonth) - 1);
                arrBenjin.push(_benjin)
                if (i < numPayMonth) {
                    lixiWhenSell += _lixi;
                    benjinWhenSell += _benjin;
                }
            }
            // console.log(arrLixi[0],arrLixi[23])
            // console.log(arrBenjin[0],arrBenjin[23])
            // console.log(arrLixi[0]+arrBenjin[0],arrLixi[23]+arrBenjin[23])

            var lastLixi = arrLixi[numPayMonth];//最后一个月的利息
            var needPayWhenSell = borrow - benjinWhenSell + lastLixi;
        } else {//1等额本金
            var arrMonthPay = [];
            // monthPay = '每月额度不固定';
            totalPay = 0;
            paybackWhenSell = 0;
            var totalBenjin = 0;
            // totalMonth
            var meiyueBenjin = borrow / totalMonth;//每个月的本金
            for (i = 0; i < totalMonth; i++) {
                var _mpay = meiyueBenjin + (borrow - totalBenjin) * monthRate;
                _mpay = Math.round(_mpay * 100) / 100;
                totalBenjin = meiyueBenjin * (i + 1);
                arrMonthPay.push(_mpay);
                totalPay += _mpay;
            }
            for (i = 0; i < numPayMonth; i++) {
                paybackWhenSell += arrMonthPay[i];
            }
            lastLixi = arrMonthPay[numPayMonth] - meiyueBenjin;
            benjinWhenSell = meiyueBenjin * numPayMonth;
            lixiWhenSell = paybackWhenSell - benjinWhenSell;
            needPayWhenSell = borrow - meiyueBenjin * numPayMonth + lastLixi;

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
        obj.zhongjieTotal = Math.floor(obj.zhongjie * total / 100);
        obj.totalFirstPay = obj.firstPay + totalTax + totalRepair + 10 + 5 + 80 + obj.zhongjieTotal;
        obj.paybackWhenSell = paybackWhenSell;
        obj.arrMonthPay = arrMonthPay;
        obj.needPayWhenSell = needPayWhenSell;
        obj.benjinWhenSell = benjinWhenSell;
        obj.lixiWhenSell = lixiWhenSell;
        obj.propertyChargesWhenSell = propertyChargesWhenSell;
        obj.totalPayWhenSell = obj.totalFirstPay + paybackWhenSell + propertyChargesWhenSell + needPayWhenSell;

        obj.basePrice = Math.ceil(obj.totalPayWhenSell / obj.area);
        if (type !== 'sellPrice' && obj.sellPrice < obj.basePrice) {
            obj.sellPrice = obj.basePrice;
        }
        obj.earnMoney = obj.sellPrice * obj.area - obj.totalPayWhenSell
        // console.log(21321,obj.monthRate)
        this.setState(obj);
    }

    firstPay() {//第一次要付的款
        const {firstPay, totalTax, totalRepair, totalFirstPay, zhongjieTotal} = this.state;
        return <div className="area">
            <div className="header">{`首付款合计: ${fmoney(totalFirstPay)}`}</div>
            <div>
                {`首付款:${fmoney(firstPay, 0)} 专项维修资金:${fmoney(totalRepair, 0)} 契税:${fmoney(totalTax)} 中介费:${zhongjieTotal}`}
            </div>
            <div>
                {`产权登记费:80 印花税:10 工本费:5`}
            </div>
        </div>
    }

    borrowArea() {//贷款信息显示区域
        const {monthPay, firstPay, total, totalMonth, totalPay, borrow, arrMonthPay, paybackType} = this.state;
        var heaerContent = `月均还款: ${fmoney(monthPay, 2)} `;
        if (paybackType === "1") {
            // var last = 
            heaerContent = `首月还款: ${fmoney(arrMonthPay[0], 2)} 末月还款: ${fmoney(arrMonthPay[arrMonthPay.length - 1], 2)} 
            每月递减：${fmoney(arrMonthPay[0] - arrMonthPay[1], 2)}
            `;
        }
        return <div className="area">
            <div className="header">{`${heaerContent} `}</div>
            <div>
                {`房款总额:${fmoney(total, 0)} 首期付款:${fmoney(firstPay, 0)}  贷款总额:${fmoney(borrow, 0)} `}
            </div>
            <div>
                {`共还款${totalMonth}期 还款总额${fmoney(cut2(totalPay), 2)} 支付利息款:${fmoney(totalPay - borrow, 2)}`}
            </div>
        </div>
    }

    sell() {//出售
        const {benjinWhenSell, lixiWhenSell, needPayWhenSell, totalPayWhenSell, totalFirstPay, paybackWhenSell, sellYear, propertyChargesWhenSell} = this.state;
        var payMonth = sellYear * 12;
        return <div className="area">
            <div className="header">{`${sellYear}年后出售时总支出: ${fmoney(totalPayWhenSell, 2)}`}</div>
            <div>
                {`首付款合计:${fmoney(totalFirstPay, 0)} 物业费:${fmoney(propertyChargesWhenSell)}`}
            </div>
            <div>
                {`已经还款${payMonth}个月总计:${fmoney(paybackWhenSell, 2)}  其中本金为:${fmoney(benjinWhenSell)} 利息为:${fmoney(lixiWhenSell, 2)}`}
            </div>
            <div>
                {`提前还款一次性还清:${fmoney(needPayWhenSell, 2)}`}
            </div>

        </div>
    }

    earnMoney() {//出售挣钱
        const {sellPrice, earnMoney, basePrice, area, total, sellYear} = this.state;
        // var basePrice = Math.ceil(totalPayWhenSell / area)
        return <div className="area">
            <div className="header">{`每平米售价在${fmoney(basePrice)}以上才有盈利`}</div>
            <div className="line">
                <div className="inLine contentOut">
                    <div className="contentIn">售价为每平米</div>
                    <InputNumber step={100} min={0} formatter={value => `${value}`} style={{width: 80}}
                                 value={sellPrice}
                                 onChange={this.onChagneValue.bind(this, 'sellPrice')}/>
                    <div
                        className="contentIn">{` 房屋总价为:${fmoney(area * sellPrice)} 涨幅:${fmoney((area * sellPrice - total) / total * 100, 2)}%
                    盈利:${fmoney(earnMoney, 0)}元`}
                    </div>
                </div>
            </div>
            <div className="clear"/>
        </div>
    }


    render() {
        // console.log(this.state)
        // const {  alPay} = this.state;
        return (
            <div className="App">
                <div className="area">
                    <div className="line">
                        <div className="inLine contentOut">
                            <div className="contentIn">面积</div>
                            <InputNumber step={0.01} formatter={value => `${value}`} style={{width: 70}}
                                         value={this.state.area}
                                         onChange={this.onChagneValue.bind(this, 'area')}/>
                            <div className="contentIn">平米</div>
                        </div>
                        <div className="inLine contentOut">
                            <div className="contentIn">平米价格</div>
                            <InputNumber min={0} formatter={value => `${value}`} step={50}
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
                            <InputNumber min={0} step={0.01} formatter={value => `${value}`} value={this.state.rate}
                                         style={{width: 60}}
                                         onChange={this.onChagneValue.bind(this, 'rate')}/>
                            <div className="contentIn">%</div>
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
                            <InputNumber min={0} step={0.1} formatter={value => `${value}`} style={{width: 50}}
                                         value={this.state.tax}
                                         onChange={this.onChagneValue.bind(this, 'tax')}/>
                            <div className="contentIn">%</div>
                        </div>
                        <div className="inLine contentOut">
                            <div className="contentIn">中介费</div>
                            <InputNumber min={0} formatter={value => `${value}`} style={{width: 50}}
                                         value={this.state.zhongjie}
                                         onChange={this.onChagneValue.bind(this, 'zhongjie')}/>
                            <div className="contentIn">%</div>
                        </div>
                    </div>
                    <div className="clear"/>
                    <div className="line">
                        <div className="inLine contentOut">
                            <div className="contentIn">专项维修资金</div>
                            <InputNumber min={0} formatter={value => `${value}`} style={{width: 50}}
                                         value={this.state.repair}
                                         onChange={this.onChagneValue.bind(this, 'repair')}/>
                            <div className="contentIn">元/平</div>
                        </div>
                        <div className="inLine contentOut">
                            <div className="contentIn">物业费</div>
                            <InputNumber min={0} step={0.1} formatter={value => `${value}`} style={{width: 50}}
                                         defaultValue={this.state.propertyCharges}
                                         onChange={this.onChagneValue.bind(this, 'propertyCharges')}/>
                            <div className="contentIn">元/平</div>
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
                {this.borrowArea()}
                {this.sell()}
                {this.earnMoney()}
            </div>
        );
    }
}

export default App;
