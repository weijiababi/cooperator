<style lang="less">
	@import '../../styles/pagination';	
</style>
<template>
	<div>
		<Card class="margin-top-16" >
			<div >
				<my-action-search :handleSearch="onSearch" :showSearch="true"  searchPlaceHolder="员工名字"  :showAdd="false">
					<Select :clearable="true"  slot="searchOption" v-model="chargeId"  placeholder="主管名字" >
						<Option v-for="item in charges" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select> 
					 <DatePicker slot="searchDate" v-model="time" type="date" placeholder="统计时间" ></DatePicker>
				</my-action-search>	
			</div>
			<Row class="margin-top-16">
				<Spin fix v-show="loading"></Spin>
	      <Table stripe ref="employeeTable" :columns="columns" :data="staffDayStatistics" border disabled-hover></Table>
				<div class="pagi-wrapper">
					<div class="pagination">
	            <Page :total="total" :page-size="pageSize" :current="currentPage" @on-change="onChangePage" show-total></Page>
	        </div>
		  	</div>
		  </Row>
    </Card>
	
	</div>
</template>

<script>
import api from '@/api'
import { 
	detailButton
 } from '@/libs/buttons';
 import filters from '@/libs/filters';
 import myActionSearch from '../my-components/myActionSearch'
export default {
	name: 'employee-index',
	components: {
		myActionSearch
	},
	watch: {
	},
	computed: {
	
	},
	data () {
		return {
			key:{
				name:''
			},
			chargeId:'',
			charges:[],
			time:'',
			pageSize:10,
			currentPage: 1,
			total:0,
			loading:false,
			staffDayStatistics:[],
			columns: [
				{
					title: '员工姓名',
					key: 'username',
				},
				{
					title: '均产出/净均产出',
					key: '',
					render:(h,params)=>{
						let key = params.row.average_subscribe+' / '+params.row.validate_subscribe
						return h('span',key)
					}
				},
				{
					title: '开机数/关机数',
					key: '',
					render:(h,params)=>{
						let key = params.row.device_on_total+' / '+params.row.device_off_total
						//console.log(params.row.system_user.username)
						return h('span',key)
					}
				},
				{
					title: '总设备数',
					key: 'device_total'
				},
				{
					title: '统计时间',
					key: '',
					render:(h,params)=>{
						let key = filters.formatTime1(params.row.create_time)

						//console.log(params.row.system_user.username)
						return h('span',key)
					}
				},
				{
					title: '操作',
					key: 'action',
					render: (h, params) => {
						let currentRowData = params.row;
            let buttons = [];
            buttons.push(detailButton(this, h, currentRowData, params.index, this.onDetail));
						return h('div',buttons);
					}
				}
			],
		}
	},
	created () {
		this.getStaffDayStatistic()
		this.getLeaders()
	},
	methods: {
		//获取员工产出统计列表
		getStaffDayStatistic(){
			let params = {
				time:filters.formatTime1(this.time),
				p_staff_id:this.chargeId||'',
				per_page:this.pageSize,
				page:this.currentPage,
				staff_name:this.key.name
			}
			console.log(params)
			this.loading = true
			api.getStaffDayStatistic(params).then(res=>{
				console.log(res)
				this.loading = false
				if(res){
					this.total = res.total
					this.staffDayStatistics = res.data
				}
			})
		},
		//切换员工列表页码
		onChangePage(page){
			this.currentPage = page
			this.getStaffDayStatistic()
		},
		//搜索
		onSearch(staff_name){
			//console.log(this.key)
			this.currentPage = 1
			this.key.name = staff_name
			this.getStaffDayStatistic()
		},
		//获取主管列表
		getLeaders(){
			let params = {
				page:1,
				per_page:100,
				p_generalize_user_id:0
			}
			api.getEmployees(params).then(res=>{
				if(res){
					let leaders = res.data
					console.log(leaders)
					for(let i=0;i<leaders.length;i++){
						let option = {
							value:leaders[i].generalize_user_id,
							label:leaders[i].name
						}
						this.charges.push(option)
					}
				}
			})
		},
		onDetail(data){
			//console.log(data)
			this.$router.push({
				name:'employees-device',
				params:{
					id:data.system_user_id
				},
				query:{
					name:data.username
				}
			})
		},
	}
}
</script>

