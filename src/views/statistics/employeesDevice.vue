<style lang="less">
	@import '../../styles/pagination';	
	.device-number{
		border-radius: 4px;
		width: 184px;
		height: 32px;
		line-height: 32px;
		padding-left: 12px;
		border:1px solid #dddee1;
	}
</style>
<template>
	<div>
		<Card class="margin-top-16" >
			<p slot="title">{{employeeName}}的设备列表</p>
			<div >
				<my-action-search :handleSearch="onSearch" :showSearch="true"  searchPlaceHolder="设备码"  :showAdd="false">
					<!-- <div slot="otherLeft" class="device-number">
						<Icon type="record" size="12" color="#19BE6B"></Icon>
						<span class="margin-left-10	">当前设备数：{{total}}台</span>
					</div> -->
					<DatePicker slot="searchDate" v-model="time" type="date" placeholder="统计时间" ></DatePicker>
				</my-action-search>	
			</div>
			<Row class="margin-top-16">
				<Spin fix v-show="loading"></Spin>
	      <Table stripe ref="employeeTable" :columns="columns" :data="staffDayDevices" border disabled-hover></Table>
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
				mch_id:''
			},
			employeeId:0,
			employeeName:'',
			time:'',
			pageSize:10,
			currentPage: 1,
			total:0,
			loading:false,
			staffDayDevices:[],
			columns: [
				{
					title: '机器码',
					minWidth:50,
					key: 'mch_id',
				},
				{
					title: '店铺名称',
					key: 'name',
				},
				{
					title: '当天产出',
					key: 'day_scan_total',
				},
				{
					title: '总开机天数/总关机天数',
					key: '',
					minWidth:50,
					render:(h,params)=>{
						let key = params.row.on_day_total+' / '+params.row.off_day_total
						//console.log(params.row.system_user.username)
						return h('span',key)
					}
				},
				{
					title: '均产出/净均产出',
					key: '',
					render:(h,params)=>{
						let key = params.row.average_total+' / '+params.row.average_valid
						return h('span',key)
					}
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
			],
		}
	},
	created () {
		// this.employeeId = this.$route.params.id
		// this.employeeName = this.$route.query.name
		// this.getStaffDeviceDetail()
	},
	activated () {
		if(this.employeeId != this.$route.params.id){
			this.employeeId = this.$route.params.id
			this.employeeName = this.$route.query.name
			this.getStaffDeviceDetail()
		}
	},	
	methods: {
		//获取员工设备产出统计列表
		getStaffDeviceDetail(){
			let params = {
				time:filters.formatTime1(this.time),
				system_user_id:this.employeeId,
				mch_id:this.key.mch_id,
				per_page:this.pageSize,
				page:this.currentPage,
			}
			console.log(params)
			this.loading = true
			api.getStaffDeviceDetail(params).then(res=>{
				console.log(res)
				this.loading = false
				if(res){
					this.total = res.total
					this.staffDayDevices = res.data
				}
			})
		},
		//切换员工设备列表页码
		onChangePage(page){
			this.currentPage = page
			this.getStaffDeviceDetail()
		},
		//搜索
		onSearch(mch_id){
			//console.log(this.key)
			this.currentPage = 1
			this.key.mch_id = mch_id
			this.getStaffDeviceDetail()
		},
	}
}
</script>

