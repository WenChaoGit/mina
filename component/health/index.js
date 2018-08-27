// component/health/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    health:{
      type:Object,
      value:{}
    }
  },
  attached(){
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDetail({currentTarget}){
      let { id } = currentTarget.dataset;
      this.triggerEvent('detail',{id})
    }
  }
})
