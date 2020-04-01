/** 建立DOM元素 */
const KHCselect = document.getElementById('area');
const list = document.querySelector('.Att_group');
const areaTitle = document.querySelector('.title');
const Hotbtn = document.querySelectorAll('.btn');
const pageArea = document.getElementById('page');
let HotbtnLe = Hotbtn.length;

/** 區域資料 */
let selectData=[
    {"KHC_area":"-- 請選擇行政區 --"},
    {"KHC_area":"三民區"},
    {"KHC_area":"美濃區"},
    {"KHC_area":"大樹區"},
    {"KHC_area":"小港區"},
    {"KHC_area":"仁武區"},
    {"KHC_area":"內門區"},
    {"KHC_area":"六龜區"},
    {"KHC_area":"左營區"},
    {"KHC_area":"田寮區"},
    {"KHC_area":"甲仙區"},
    {"KHC_area":"杉林區"},
    {"KHC_area":"岡山區"},
    {"KHC_area":"前鎮區"},
    {"KHC_area":"苓雅區"},
    {"KHC_area":"茂林區"},
    {"KHC_area":"茄萣區"},
    {"KHC_area":"桃源區"},
    {"KHC_area":"梓官區"},
    {"KHC_area":"前金區"},
    {"KHC_area":"楠梓區"},
    {"KHC_area":"鼓山區"},
    {"KHC_area":"旗津區"},
    {"KHC_area":"鳳山區"},
    {"KHC_area":"永安區"}
]
/** 透過AJAX取得JSON資料 */
let Att_str ='';
function getAttData(){
    const xhr = new XMLHttpRequest();
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true);
    xhr.send(null);
    xhr.onload = function() {
        if (xhr.status == 200) {           
            Att_str = JSON.parse(xhr.responseText); 
        }else {
            document.querySelector('.Att_group').innerHTML = '<h2>取得資料時發生錯誤!!</h2>';
        }
    }
}
/** 下拉式選單 */
AreaSelect();
function AreaSelect(){
    let Options = '';
    let KHC_areaLn = selectData.length;
    for(let i =0 ; i<KHC_areaLn ; i++){
        let selectAllName = selectData[i].KHC_area;
        Options += `<option value="${selectAllName}">${selectAllName}</option> `;
    }
    document.querySelector('.area').innerHTML =Options;
}
function select_Hotbtn(){
    /** 選單點選後觸發 */
    KHCselect.addEventListener('change',select,false);
    /** 熱門按鈕事件觸發 */
    for( let i = 0; i < HotbtnLe; i++){
        Hotbtn[i].addEventListener('click',select,false);
    }
}

/** 取得行政區 */
function select(e){
    let selectStr = e.target.value;
    KHC_Data(selectStr);
}

/** 把選擇的行政資料放入陣列 */
function KHC_Data(selectStr){    
    let Datale = Att_str.result.records.length;
    let arr = [];        
    for(let i = 0; i < Datale; i++){
        if(Att_str.result.records[i].Zone == selectStr){
            arr.push({
                Zone:Att_str.result.records[i].Zone,
                Add:Att_str.result.records[i].Add,
                Name:Att_str.result.records[i].Name,
                Opentime:Att_str.result.records[i].Opentime,
                Tel:Att_str.result.records[i].Tel,
                Picturel:Att_str.result.records[i].Picture1,
                Ticketinfo:Att_str.result.records[i].Ticketinfo
            });           
        }else if(selectStr == selectData[0].KHC_area) {
            alert('我不是行政區 (￣▽￣)~* ');
            arr.push ('');  
            break;
        }
    }   
    areaTitle.textContent = selectStr; 
    getPage(arr);
}

/** 分頁功能 */
function getPage(arr){   
    let page = 1; //預設頁數
    let rows = 4; //每頁資料上限
    let totalData = arr.length; //所有資料長度

    //如果資料超過上限新增頁數
    let totalPage = 1; //預設總頁數
    let pages = totalData / rows;  //總頁數
    if (pages > parseInt(pages)){
        totalPage = parseInt(pages) + 1;
    }else{
        totalPage = parseInt(pages); 
    }
    // 頁數超過一頁，顯示頁數
    if (totalData > rows){
        pageArea.style.display = "flex";
    }else{
        pageArea.style.display = "none";
    } 
    
    let start = (page-1) * rows + 1; //起始資料  
    let end = page * rows; //最後資料
    
    /** 判斷頁數是否只有一頁 */
    if (totalPage == 1 ){ 
        end = totalData;
    } 

    function pageBtn(page){
        // console.log(page,totalPage)
        let btn = "";
        for(let i= 1 ; i < totalPage +1; i++){
            //如果是目前頁數改變按鈕顏色
            if( i == page){
                btn += `
                <li class="pagebtn">
                    <a class="pagelink active" href="#" data-num="${i}">${i}</a>
                </li>`;
            }else{
                btn += `
                <li class="pagebtn">
                    <a class="pagelink" href="#" data-num="${i}">${i}</a>
                </li>`;
            }
        }
        pageArea.innerHTML = btn ;
    }
    pageBtn(page);
    getData(start,end,arr);

    /** 切換分頁 */
    pageArea.addEventListener('click',pageClick,false); 
    function pageClick(e){
        e.preventDefault();
        //如果不是button回傳
        if (e.target.nodeName !== "A"){
            return;
        }
        let pageNum = parseInt(e.target.dataset.num);
        page = pageNum;
        /** 目前頁數資料 */
        if (pageNum > 0 && pageNum < totalPage){ 
            start = (pageNum-1) * rows + 1;
            end =  pageNum * rows;
        } else if(pageNum == totalPage){ 
            /** 最後一頁顯示剩下的資料 */
            start = (pageNum-1) * rows + 1;
            end =  totalData;
        }
        getData(start,end,arr);
        pageBtn(page);
    }
}

/** 顯示景點資料 */
function getData(start,end,arr){
    let str = '';
    if(arr == ''){
        str += '';
        list.innerHTML = str;
    }else{
        for (let i=start - 1 ; i<end ; i++){
            
                str += `
                <div class="Att_box" data-id="${i}">
                    <img class="Att_img" src = "${arr[i].Picturel}">
                    <h3><span>${arr[i].Name}</span></h3>
                    <p><span class="Zone">${arr[i].Zone}</span></p>
                    <p><i class="fas fa-map-marker-alt"></i>${arr[i].Add}</span></p>
                    <p><i class="fas fa-phone-alt"></i><span>${arr[i].Tel}</span></p>
                    <p><i class="fas fa-clock"></i><span>${arr[i].Opentime}</span></p>`
                if(arr[i].Ticketinfo == "免費參觀"){
                    str += `
                    <div class="ticket_icon">
                    <i class="fas fa-ticket-alt"></i>${arr[i].Ticketinfo}
                    </div></div></div></div>`;
                }else{
                    str += `</div></div></div>`;
                }
            }
        
        list.innerHTML = str;
        document.querySelector('.Att_img').onload = function(){
            getAttHeight();          
        }
    }
}

/** 處理資料跑版問題 */
function getAttHeight(){
    const AttHeight = document.querySelectorAll('.Att_box');
    const Attimg = document.querySelectorAll('.Att_img')
    let AttboxLe = AttHeight.length;
    for(let i = 0; i<AttboxLe;i+=2){
        AttHeight[i].classList.add('clearfix');                      
    }
    for(let i = 0; i<AttboxLe; i++){
        if(AttHeight[i].offsetHeight > 350){
            AttHeight[i].style.lineHeight="26px";
            AttHeight[i].style.padding="0 0 1em 0";
            Attimg[i].style.margin="0 0 1em 0";
        }
        //console.log(AttHeight[i].offsetHeight)
    }
}

/** 執行程式 */
function goStart(){
    getAttData();
    select_Hotbtn();
}
window.onload = goStart();
