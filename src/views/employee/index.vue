<style lang="less">

</style>
<template>
	<div>
		<Card class="margin-top-16" >
			<div >
				<my-action-search :handleSearch="onSearch" :showSearch="true" addText="添加员工" searchPlaceHolder="员工名字" :handleAdd="onAdd" :showAdd="true"></my-action-search>	
			</div>
			<Row class="margin-top-16">
				<Spin fix v-show="loading"></Spin>
	      <Table stripe ref="employeeTable" :columns="columns" :data="employees" border disabled-hover></Table>
				<div class="pagi-wrapper">
					<div class="pagination">
	            <Page :total="total" :page-size="pageSize" :current="currentPage" @on-change="onChangePage" show-total></Page>
	        </div>
		  	</div>
		  </Row>
    </Card>
		
		<Modal :title="actionText" v-model="actionModal" class-name="vertical-center-modal">
			<Form :model="form" @submit.native.prevent :rules="ruleCustom" :label-width="100" ref="form">
				<FormItem  prop="name" label='名字'>
					<Input v-model="form.name"></Input>
				</FormItem>
				<FormItem v-show="!(action==1&&actionIsLeader)"  prop="p_generalize_user_name" label='员工领导'>
					<Input v-model="form.p_generalize_user_name" readonly></Input>
					<Button type="primary" @click="selectLeader">请选择</Button>
				</FormItem>
				<FormItem  prop="username" label='用户账号'>
					<Input v-model="form.username" readonly></Input>
					<Button type="primary" @click="selectAccount">请选择</Button>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button @click="submitAction" :loading="actionLoading"  type="primary">提交</Button>
				<Button @click="actionModal = false">取消</Button>
			</div>
    </Modal>
		<Modal title="选择主管" v-model="leaderModal" >
			<Spin fix v-show="leaderLoading"></Spin>
			<Table  ref="leaderTable" @on-current-change="selectLeaderChange" highlight-row  :columns="leaderColumns" :data="leaders" border></Table>
			<div class="pagi-wrapper">
				<div class="pagination">
            <Page :total="leaderTotal" :page-size="10" :current="currentLeaderPage" @on-change="onChangeLeaderPage" show-total></Page>
        </div>
	  	</div>
	  	<div slot="footer">
	  		<Button @click="submitLeader" type="primary">确定</Button>
	  		<Button @click="leaderModal = false">取消</Button>
	  	</div>
    </Modal>
    <Modal title="选择账号" v-model="accountModal" >
    	<Row>
				<Col span="5">
					<Input v-model="accountKey" placeholder="账号" />
				</Col>
				<Col span="3">
					<Button icon="ios-search" @click="onAccountSearch" title="搜索"></Button>
				</Col>
			</Row>
			<Row class="margin-top-10">
				<Spin fix v-show="accountLoading"></Spin>
				<Table  ref="accountTable" @on-current-change="selectAccountChange" highlight-row  :columns="accountColumns" :data="accounts" border></Table>
				<div class="pagi-wrapper">
					<div class="pagination">
	            <Page :total="accountTotal" :page-size="10" :current="currentAccountPage" @on-change="onChangeAccountPage" show-total></Page>
	        </div>
		  	</div>
		  </Row>
		  <div slot="footer">
		  	<Button @click="submitAccount" type="primary">确定</Button>
		  	<Button @click="accountModal = false">取消</Button>
		  </div>
    </Modal>
	
	</div>
</template>

<script>
import api from '@/api'
import { 
  deleteButton,
	editButton
 } from '@/libs/buttons';
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
			pageSize:10,
			currentPage: 1,
			total:0,
			actionModal:false,
			actionLoading:false,
			actionText:'',
			action:0,//0是添加，1是编辑
			actionIsLeader:false,
			currentEmployeeId:0,
			form: {
				name:'',
				p_generalize_user_name:'',
				p_generalize_user_id:0,
				user_id:0,
				username:''
			},
			ruleCustom: {
				name: [{
					required: true,
					message: '此处不能为空值',
					trigger: 'blur'
				}],
				username: [{
					required: true,
					message: '此处不能为空值'
				}]
			},
	
			currentId:0,
			currentName:'',
			loading:false,
			columns: [
				{
					title: '员工姓名',
					key: 'name',
				},
				{
					title: '归属主管',
					key: 'p_generalize_user',
					render:(h,params)=>{
						let name = ''
						if(params.row.p_generalize_user){
							name = params.row.p_generalize_user.name
						}	
						//console.log(params.row.p_generalize_user.name)
						return h('span',name)
					}
				},
				{
					title: '绑定账号',
					key: 'system_user',
					render:(h,params)=>{
						//console.log(params.row.system_user.username)
						return h('span',params.row.system_user.username)
					}
				},
				{
					title: '操作',
					key: 'action',
					render: (h, params) => {
						let currentRowData = params.row;
            let buttons = [];
            buttons.push(editButton(this, h, currentRowData, params.index, this.onEdit));
            buttons.push(deleteButton(this, h, currentRowData, params.index, this.onDelete));
						return h('div',buttons);
					}
				}
			],
			employees: [],
			leaders:[],
			currentLeaderPage: 1,
			leaderTotal:0,
			leaderModal:false,
			leaderLoading:false,
			currentLeader:{},
			leaderColumns: [
				{
					title: '员工姓名',
					key: 'name',
				},
				{
					title: '绑定账号',
					key: 'system_user',
					render:(h,params)=>{
						//console.log(params.row.system_user.username)
						return h('span',params.row.system_user.username)
					}
				}
			],
			accounts:[],
			currentAccountPage: 1,
			accountTotal:0,
			accountModal:false,
			accountLoading:false,
			currentAccount:{},
			accountColumns: [
				{
					title: '账号',
					key: 'username',
				}
			],
			accountKey:'',
			currentAccountKey:''
		}
	},
	created () {
		this.getEmployees()
		//this.getLeaders()
	},
	methods: {
		//获取员工列表
		getEmployees(){
			let params = {
				per_page:this.pageSize,
				page:this.currentPage,
				name:this.key.name
			}
			this.loading = true
			api.getEmployees(params).then(res=>{
				console.log(res)
				this.loading = false
				if(res){
					this.total = res.total
					this.employees = res.data
				}
			})
		},
		//切换员工列表页码
		onChangePage(page){
			this.currentPage = page
			this.getEmployees()
		},
		//搜索
		onSearch(name){
			//console.log(this.key)
			this.currentPage = 1
			this.key.name = name
			this.getEmployees()
		},
		initAction(){
			this.currentAccountKey = ''
			this.accountKey = ''
			this.currentLeaderPage = 1
			this.getLeaders()
			this.currentAccountPage = 1
			this.getAccounts()
			this.$refs.form.resetFields()
		},
		//点击添加按钮
		onAdd(){
			this.initAction()
			this.form = {
				name:'',
				p_generalize_user_name:'',
				p_generalize_user_id:0,
				user_id:0,
				username:''
			}
			this.action = 0
			this.actionModal = true
			this.actionText = '添加'
		},
		//点击提交按钮
		submitAction(){
 			this.$refs.form.validate((valid) => {
 				if (valid) {
 					//console.log(this.form)
 					let params = {
 						name:this.form.name,
 						p_generalize_user_id:this.form.p_generalize_user_id,
 						user_id:this.form.user_id
 					}
 					this.actionLoading = true
 					if(this.action == 0){
 						this.addAction(params)
 					}else if(this.action == 1){
 						this.editAction(params)
 					}
 				}
 			});
 		}, 
 		//添加员工操作
 		addAction(params){
 			api.addEmployee(params).then(res=>{
 				console.log(res)
 				this.actionLoading = false
 				if(res){
 					this.$Message.success('添加成功');
 					this.actionModal = false
 					this.currentPage = 1
 					this.getEmployees()
 				}
 			})
 		},
 		//编辑员工操作
 		editAction(params){
 			params.generalize_user_id = this.currentEmployeeId
 			api.editEmployee(params).then(res=>{
 				console.log(res)
 				this.actionLoading = false
 				if(res){
 					this.$Message.success('编辑成功');
 					this.actionModal = false
 					this.currentPage = 1
 					this.getEmployees()
 				}
 			})
 		},
 		//获取主管列表
		getLeaders(){
			let params = {
				page:this.currentLeaderPage,
				p_generalize_user_id:0
			}
			this.leaderLoading = true
			api.getEmployees(params).then(res=>{
				console.log(res)
				this.leaderLoading = false
				if(res){
					this.leaderTotal = res.total
					this.leaders = res.data
				}
			})
		},
		//弹出主管列表窗口
		selectLeader(){
			this.leaderModal = true
		},
		//选择主管
		selectLeaderChange(currentRow){
			console.log(currentRow)
			this.currentLeader = currentRow
		},
		//确定所选主管
		submitLeader(){
			this.form.p_generalize_user_name = this.currentLeader.name
			this.form.p_generalize_user_id = this.currentLeader.generalize_user_id
			this.leaderModal = false
		},
		//切换主管列表页码
		onChangeLeaderPage(page){
			this.currentLeaderPage = page
			this.getLeaders()
		},
		//获取账号列表
		getAccounts(){
			let params = {
				username:this.currentAccountKey,
				page:this.currentAccountPage,
			}
			this.accountLoading = true
			api.getUsers(params).then(res=>{
				console.log(res)
				this.accountLoading = false
				if(res){
					this.accountTotal = res.total
					this.accounts = res.data
				}
			})
		},
		//弹出账号列表窗口
		selectAccount(){
			this.accountModal = true
		},
		//选择账号
		selectAccountChange(currentRow){
			console.log(currentRow)
			this.currentAccount = currentRow
		},
		//确定所选账号
		submitAccount(){
			this.form.username = this.currentAccount.username
			this.form.user_id = this.currentAccount.id
			this.accountModal = false
		},
		//切换账号列表页码
		onChangeAccountPage(page){
			this.currentAccountPage = page
			this.getAccounts()
		},
		//点击编辑按钮
		onEdit(currentRow){
			this.actionIsLeader = false
			this.currentEmployeeId = currentRow.generalize_user_id
			console.log(currentRow)
			this.initAction()
			this.actionIsLeader = currentRow.p_generalize_user_id==0?true:false
			this.form = {
				name:currentRow.name,
				p_generalize_user_name:currentRow.p_generalize_user?currentRow.p_generalize_user.name:'',
				p_generalize_user_id:currentRow.p_generalize_user?currentRow.p_generalize_user.generalize_user_id:'',
				user_id:currentRow.system_user.id,
				username:currentRow.system_user.username
			}
			this.actionModal = true
			if(this.actionIsLeader){
				this.actionText = '编辑主管'+currentRow.name
			}else{
				this.actionText = '编辑员工'+currentRow.name
			}
			this.action = 1
		},
		//点击删除按钮
		onDelete(currentRow){
			console.log(currentRow)
			let params = {
				generalize_user_ids:[currentRow.generalize_user_id]
			}
			this.loading = true
			api.delEmployee(params).then(res=>{
 				console.log(res)
 				this.loading = false
 				if(res){
 					this.$Message.success('删除成功');
 					this.currentPage = 1
 					this.getEmployees()
 				}
 			})
		},
		//搜索
		onAccountSearch(){
			//console.log(this.key)
			this.currentAccountPage = 1
			this.currentAccountKey = this.accountKey
			this.getAccounts()
		},
	}
}
</script>

