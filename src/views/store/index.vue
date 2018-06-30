<style lang="less">

</style>
<template>
	<div>
		<Card class="margin-top-16" >
			<div>
				<my-action-search :handleSearch="onSearch" :showSearch="true"  searchPlaceHolder="店铺名称"  :showAdd="false">
					<Input slot="twoSearch" v-model.trim="mch_id" @on-change="" 
            placeholder="机器码" />		
          <Input slot="threeSearch" v-model.trim="system_user_name" @on-change="" 
            placeholder="负责人" />		
          <Input slot="fourSearch" v-model.trim="address" @on-change="" 
            placeholder="地址" />
				</my-action-search>	
			</div>
			<Row class="margin-top-16">
				<Spin fix v-show="loading"></Spin>
	      <Table stripe ref="storeTable" :columns="columns" :data="stores" border disabled-hover></Table>
				<div class="pagi-wrapper">
					<div class="pagination">
	            <Page :total="total" :page-size="pageSize" :current="currentPage" @on-change="onChangePage" show-total></Page>
	        </div>
		  	</div>
		  </Row>
    </Card>
    <Modal title="修改负责人" v-model="principalModal">
			<div v-if="principalModal">
				<my-action-search :handleSearch="onPrincipalSearch" :showSearch="true"  searchPlaceHolder="名字"  :showAdd="false">
				</my-action-search>	
			</div>
			<Row class="margin-top-16">
				<Spin fix v-show="principalLoading"></Spin>
	      <Table stripe ref="storeTable" :columns="principalColumns" :data="principals" border disabled-hover></Table>
				<div class="pagi-wrapper">
					<div class="pagination">
	            <Page :total="principalTotal" :page-size="principalPageSize" :current="principalCurrentPage" @on-change="onChangePrincipalPage" show-total></Page>
	        </div>
		  	</div>
		  </Row>
		  <div slot="footer">
		  	<Button @click="principalModal = false" size="large">关闭</Button>
		  </div>
    </Modal>
	
	</div>
</template>

<script>
import api from '@/api'
import { 
  detailButton,
  editSystemUserButton,
  selectSystemUserButton,
 } from '@/libs/buttons';
import filters from '@/libs/filters';
import myActionSearch from '../my-components/myActionSearch'
export default {
	name: 'store-index',
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
				name:'',
				mch_id:'',
				system_user_name:'',
				address:'',
			},
			system_user_name:'',
			mch_id:'',
			address:'',
			pageSize:10,
			currentPage: 1,
			total:0,
			loading:false,
			columns: [
				{
					title: '店铺名称',
					key: 'name',
				},
				{
					title: '负责人',
					key: 'system_user',
					render:(h,params)=>{
						let name = ''
						if(params.row.system_user){
							name = params.row.system_user.username
						}	
						//console.log(params.row.p_generalize_user.name)
						return h('span',name)
					}
				},
				{
					title: '店铺地区',
					key: 'region',
					render:(h,params)=>{
						let address = " -- "
						if(params.row.province_name){
							address  = params.row.province_name 
						}
						if(params.row.city_name){
							address += "-" + params.row.city_name
						}
						if(params.row.area_name){
							address += "-" + params.row.area_name
						}
						//console.log(params.row.system_user.username)
						return h('span',address)
					}
				},
				{
					title: '店铺地址',
					key: 'address',
					width:250
				},
				{
					title: '联系电话',
					key: 'phone'
				},
				{
					title: '操作',
					key: 'action',
					width:200,
					render: (h, params) => {
						let currentRowData = params.row;
            let buttons = [];
            //buttons.push(detailButton(this, h, currentRowData, params.index, this.onDetail));
            buttons.push(editSystemUserButton(this, h, currentRowData, params.index, this.editSystemUser));
						return h('div',buttons);
					}
				}
			],
			stores: [],
			currentStoreId:0,
			principalModal:false,
			principals:[],
			principalColumns: [
				{
					title: '负责人',
					key: 'username'
				},
				{
					title: '注册日期',
					key: 'update_time',
					render:(h,params)=>{
						let key = filters.formatTime1(params.row.update_time)
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
            buttons.push(selectSystemUserButton(this, h, currentRowData, params.index, this.selectSystemUser));
						return h('div',buttons);
					}
				}
			],
			principalCurrentPage:1,
			principalPageSize:5,
			principalTotal:0,
			principalLoading:false,
			principalKey:{
				name:''
			},
		}
	},
	created () {
		this.getStores()
		this.getPrincipals()
	},
	methods: {
		//获取店铺列表
		getStores(){
			let params = {
				per_page:this.pageSize,
				page:this.currentPage,
				name:this.key.name, 
				address:this.key.address,
    		mch_id:this.key.mch_id,
    		system_user_name:this.key.system_user_name
			}
			this.loading = true
			api.getStores(params).then(res=>{
				console.log(res)
				this.loading = false
				if(res){
					this.total = res.total
					this.stores = res.data
				}
			})
		},
		//切换店铺列表页码
		onChangePage(page){
			this.currentPage = page
			this.getStores()
		},
		//搜索
		onSearch(name){
			//console.log(this.key)
			this.currentPage = 1
			this.key.name = name
			this.key.address = this.address
			this.key.mch_id = this.mch_id
			this.key.system_user_name = this.system_user_name
			this.getStores()
		},
		//跳转到详情页面
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
		//弹出修改负责人列表窗口
		editSystemUser(currentRow){
			//console.log(currentRow)
			this.currentStoreId = currentRow.id
			this.principalModal = true
			if(this.principalKey.name||this.principalCurrentPage!=1){
				this.principalKey.name = ''
				this.principalCurrentPage = 1
				this.getPrincipals()
			}
			
		},
		//获取负责人列表
		getPrincipals(){
			let params = {
				per_page:this.principalPageSize,
				page:this.principalCurrentPage,
				username:this.principalKey.name
			}
			this.principalLoading = true
			api.getSystemUser(params).then(res=>{
				console.log(res)
				this.principalLoading = false
				if(res){
					this.principalTotal = res.total
					this.principals = res.data
				}
			})
		},
		//搜索负责人
		onPrincipalSearch(name){
			//console.log(this.key)
			this.principalCurrentPage = 1
			this.principalKey.name = name
			this.getPrincipals()
		},
		//确定所选负责人
		selectSystemUser(currentRow){
			//console.log(currentRow)
			let params = {
				id:this.currentStoreId,
				system_user_id:currentRow.id
			}
			api.editSystemUser(params).then(res=>{
 				console.log(res)
 				if(res){
 					this.$Message.success('选择成功');
 					this.principalModal = false
 					this.currentPage = 1
 					this.getStores()
 				}
 			})
		},
		//切换负责人列表页码
		onChangePrincipalPage(page){
			this.principalCurrentPage = page
			this.getPrincipals()
		},
	}
}
</script>

