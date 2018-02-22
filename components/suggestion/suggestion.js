// components/suggestion.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    suggestion: {            // 属性名
      type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: ''     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    suggestion: {"car_washing": { "brief": "较适宜", "details": "" }, "dressing": { "brief": "较冷", "details": "" }, "flu": { "brief": "极易发", "details": "" }, "sport": { "brief": "较不宜", "details": "" }, "travel": { "brief": "适宜", "details": "" }, "uv": { "brief": "最弱", "details": "" } }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
