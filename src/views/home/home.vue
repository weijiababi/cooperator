<style lang="less">
    @import "./home.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" :src="avatorPath" />
                                    </Row>
                                </Col>
                                <Col span="16" style="padding-left:6px;">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <div>
                                            <b class="card-user-infor-name">{{name}}</b>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                   
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
 import Cookies from 'js-cookie';
export default {
    name: 'home',
    components: {
      
    },
    data () {
        return {
            name:''
        };
    },
    created(){
        this.name = Cookies.get('user');
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
    }
};
</script>
