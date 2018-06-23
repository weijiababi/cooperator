<template>
    <Row class="margin-bottom-16">
        <Col span="6" style="float: left;" v-show="showAdd">
            <div >
                <Button icon="plus" type="primary" @click="toAdd" >{{addText}}</Button>
            </div>
        </Col>
        <Col span="6" style="float: left;" >
           <slot name="otherLeft"></slot> 
        </Col>
        <Col style="width: 57px; float:right;" v-show="showSearch">
            <Button  type="primary"  @click="onSearch" >搜索</Button>
        </Col>
        <Col span="5" style="margin-right: 16px;float: right;" v-show="showSearch">
            <Input v-model.trim="searchConName" @on-change="" 
            :placeholder="searchPlaceHolder" />
        </Col>
        <Col span="5" style="margin-right: 16px;float: right;">       
            <slot name="twoSearch"></slot>      
        </Col>    
         <Col span="5" style="margin-right: 16px;float: right;">       
            <slot name="threeSearch"></slot>      
        </Col> 
        <Col style="width: 100px;margin-right: 16px;float: right;">       
            <slot name="searchOption"></slot>      
        </Col>     
        <Col style="width:120px;margin-right: 16px;float: right;">        
            <slot name="searchDate"></slot>        
        </Col>
    </Row>
</template>
<script>
    export default {
        name: 'my-action-search',
        components: {
            
        },
        props:{     
            showSearch: {     
                type: Boolean,     
                default: true      
            },
            showAdd: {     
                type: Boolean,     
                default: true      
            },
            addText:{
                type: String,
                default: '添加'
            },
            searchPlaceHolder: {
                type: String,
                default: '输入以搜索...'
            },
            handleSearch: {
                type: Function,
                default: function (keyword) {
                   console.log(keyword);
                }
            },
            handleAdd: {
                type: Function,
                default: function() {
                    
                }
            },
        },
        data () {
            return {
               searchConName:'',
            };
        },
        methods: {
            onSearch () {       
                this.handleSearch(this.searchConName);      
            },
            toAdd(){
                this.handleAdd()
            }
        }
    };
</script>
