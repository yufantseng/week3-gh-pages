// import axios from 'axios';
// 建立 Vue
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 宣告 productModal, deleteProduct 為空值
let productModal = null;
let deleteProduct = null;

createApp({
  // 建立資料
  data(){
    return{
      // 六角學院的 api URL
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      // 個人申請的 api path
      apiPath: 'yufan-55140',
      // 所有商品資料
      products: [],
      // 建立新舊商品判斷預設值
      isNew: false,
      // 建立暫存資料物件
      tempProduct: {
        // 建立暫存資料物件的空照片矩陣
        imagesUrl: [],
      },
    }
  },
  mounted(){
    // 建立 Boostrap Modal 互動視窗並指向 html 中的 productModal id
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      // Modal 打開時按下 esc 鍵不會關閉 Modal
      keyboard: false
    });
    // 建立 Boostrap Modal 並指向 html 中的 deleteProductModal id
    deleteProduct = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
      // Modal 打開時按下 esc 鍵不會關閉 Modal
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    // 存入 Token 後每當訪問頁面自動執行使用者驗證
    this.checkAccount();
  },
  methods: {
    checkAccount(){
      // 宣告 url 函數為 六角 api Url 並使用登入及驗證 api
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        // 若使用者登入驗證成功則 trigger getData 功能渲染 api 資料進 products 所有商品資料中
        .then(() => {
          this.getData();
        })
        // 若使用者登入驗證失敗則顯示 error 回傳錯誤訊息並跳回 login.html 登入頁面
        .catch((error) => {
          alert(error.response.data.message)
          window.location = 'login.html';
        })
    },
    getData(){
      // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品 api
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        // 若成功讀取遠端 api 商品資料則渲染 response 資料進 products 所有商品資料中
        .then((response) => {
          this.products = response.data.products;
        })
        // 若使用者登入驗證失敗則顯示 error 回傳錯誤訊息
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    updateProduct(){
      // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品 api
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      // 宣告 http 協定為 post 新增資料
      let http = 'post';
      
      // 若非新商品則套用以下 url 和 http 協定設定
      if (!this.isNew) {
        // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品 api 加上暫存資料物件的 id
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        // 宣告 http 協定為 put 修改資料
        http = 'put'
      }

      // axios 套用以上判斷並相應索取資訊
      axios[http](url, { data: this.tempProduct })
      // 若點擊後成功編輯資料則回傳 response 資料中的訊息
      .then((response) => {
        alert(response.data.message);
        // 若點擊後成功編輯資料則關閉 productModal Modal
        productModal.hide();
        // 若點擊後成功編輯資料則重新 trigger getData 功能渲染編輯後資料進 products
        this.getData();
      })
      // 取得所點選編輯資料則回傳 error 錯誤訊息
      .catch((err) => {
        alert(err.response.data.message);
      })
    },
    openModal(isNew, item){
      // 若判斷為新產品則打開皆為空值的新產品 Modal
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      // 若判斷為編輯既有產品則傳入所點選 item 資料進 tempProduct 並顯示於 Modal
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      // 若判斷為刪除既有產品則傳入所點選 item 資料進 tempProduct 並顯示於 delete Modal
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        deleteProduct.show()
      }
    },
    deleteProduct(){
      // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品中的刪除商品 api
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      // const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;

      axios.delete(url)
      // 若成功刪除所點選的商品資料則重新 trigger getData 功能渲染 api 資料進 products 所有商品資料中
      .then((response) => {
        alert(response.data.message);
        deleteProduct.hide();
        this.getData();
      })
      // 若失敗刪除所點選的商品資料則顯示 error 回傳錯誤訊息
      .catch((err) => {
        alert(err.response.data.message);
      })
    },
    createImages(){
      // 觸發後顯示空的 tempProduct 暫存資料
      this.tempProduct.imagesUrl = [];
      // 觸發後加入新產品圖片資料進 tempProduct 暫存資料中的 imagesUrl 陣列
      this.tempProduct.imagesUrl.push('');
    },
  },
// 將 createApp 掛載於 '＃app' id 上
}).mount('#app');