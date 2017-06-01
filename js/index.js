/**
 * Created by wkyyc on 2017/5/7.
 */
window.onload=function(){
    function PicSlideObj(piclis,pointer){
        this.time;
        this.piclis=piclis;
        this.pointer=pointer;
    };
    PicSlideObj.prototype={
        //nodes转换成数组
        changArray:function(nodes){
            var array=null;
            try{
                array=Array.prototype.slice.call(nodes,0);
            }catch(ex){
                array=new Array();
                for(var i=0,len=nodes.length;i<len;i++){
                    array.push(nodes[i]);
                }
            }
            return array;
        },
        //遍历解析出li标签
        findLis:function(ele){
            if(!document.getElementsByClassName){
                document.getElementsByClassName=function(gebc){
                    var children=document.getElementsByTagName("*");
                    var elements=new Array();
                    for(var i=0,len=children.length;i<len;i++){
                        if(children[i].className==gebc){
                            console.log(children[i].className);
                            elements.push(children[i]);
                        }
                    }
                    return elements;
                }

            }
            console.log(document.getElementsByClassName(ele));
            var e=document.getElementsByClassName(ele)[0];
            var childs=this.changArray(e.childNodes);
            var ulEle=childs.filter(function(v,i,a){
                return v.nodeName=="UL";
            });
            var liEles=this.changArray(ulEle[0].childNodes).filter(function(v,i,array){
                return v.nodeName==="LI";
            });
            return liEles;
        },
        picSlide:function(p1,p2,n,index){
            try{
                index=arguments[3]?index:1;
                index = (index % n)==0?1:(index%n);
                p1.forEach(function (v, i, a) {
                    v.style.display = "none";
                });
                p2.forEach(function (v, i, a) {
                    v.style.background = "#fff";
                });
                p1[index-1].style.display = "block";
                p2[index-1].style.background = "red";

            }catch(ex){}
        }
        ,
        picSlideAuto:function(n,index){
            //    解析出图片li
                index=arguments[1]?index:1
                var p1=this.findLis(this.piclis);
                var p2=this.findLis(this.pointer);
                this.picSlide(p1,p2,n,index);
                var _this=this;

                this.time = setInterval(function () {
                    try{
                        index++;
                        _this.picSlide(p1,p2,n,index);
                    }catch(ex){
                        clearInterval(_this.time);
                    }
                }, 1000);
        },
    //    添加事件跨浏览器兼容写法
        eventUtil:function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else if(element.attachEvent){
                element.attachEvent("on"+type,handler);
            }else{
                element["on"+type]=handler;
            }
        }
    };
    var p=new PicSlideObj("pic-slide","pic-slide-pointer");
    //主页面轮播图
    p.picSlideAuto(9);
//   几个li标签的轮播事件  mouseover事件和mouseout事件
    p.findLis("pic-slide-pointer").forEach(function(v,i,a){

        var vonmouseover=function(event){
            clearInterval(p.time);
            p.findLis(p.piclis).forEach(function(v,i,a){
                v.style.display="none";
            });
            p.findLis(p.pointer).forEach(function(v,i,a){
                v.style.background="#fff";
            });
            v.style.background="red";
            p.findLis(p.piclis)[i].style.display="block";
        }
        var vonmouseout=function(event){
            p.picSlideAuto(9,i+1);
        }
        p.eventUtil(v,"mouseover",vonmouseover);
        p.eventUtil(v,"mouseout",vonmouseout);
    });
//    鼠标放置到a标签上时，左右点击图片滑动按钮出现
    var left=document.querySelector(".viewpager.pic-slid-left.iconfont");
    var right=document.querySelector(".viewpager.pic-slid-right.iconfont");
    p.findLis("pic-slide").forEach(function(v,i,a){
    //    finda
        var as=p.changArray(v.childNodes).filter(function(va,index,array){
            return va.nodeName=="A";
        });
        var asonmouseover=function(event){
            left.style.display="block";
            right.style.display="block";
        };
        p.eventUtil(as[0],"mouseout",asonmouseover);
    });
//    left right点击事件
    function leftRightClick(n,increase){
        var p1=p.findLis(p.piclis);
        var p2=p.findLis(p.pointer);
        //获取当前指针停留位置
        var pointIndex;
        p.findLis(p.piclis).forEach(function(v,i,a){
            if(v.style.display=="block"){
                pointIndex=i;
            }
        });
        console.log(pointIndex+"pointIndex");
        if(increase>0){
            pointIndex++;
        }else{
            (pointIndex==0)?(pointIndex=n-2):pointIndex--;
        }
        p.picSlide(p1,p2,n,pointIndex+1);

    }
    function leftRightOut(n){
        //获取当前指针停留位置
        var pointIndex;
        p.findLis(p.piclis).forEach(function(v,i,a){
            if(v.style.display=="block"){
                pointIndex=i;
            }
        });
        p.picSlideAuto(n,pointIndex+1);

    }
    var clearTime=function(){
        clearInterval(p.time);
    };
    var arrowMouseOut=function(){
        leftRightOut(9);
    };
    p.eventUtil(left,"mouseover",clearTime);
    p.eventUtil(right,"mouseover",clearTime);
    p.eventUtil(left,"mouseout",arrowMouseOut);
    p.eventUtil(right,"mouseout",arrowMouseOut);
    var leftonclick=function (event) {
        leftRightClick(9,-1);
    };
    var rightonclick=function (event) {
        leftRightClick(9,1);
    };
    p.eventUtil(left,"click",leftonclick);
    p.eventUtil(right,"click",rightonclick);

}
