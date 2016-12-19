// post list check box controller and delete

var chk = document.getElementsByName("checkPost");
var check = false;
function checkAll(){
    if(check == false){
        check = true;
        for(var i=0; i<chk.length;i++){
            chk[i].checked = true;     //모두 체크
        }
    }else{
        check = false;
        for(var i=0; i<chk.length;i++){
            chk[i].checked = false;     //모두 해제
        }
    }
}

function deleteChk(){
    if(confirm('삭제하시겠습니까?')){
        var checked = new Array();
        for(i=0;i<chk.length;i++){
            if(chk[i].checked==true){
                checked.push(chk[i].value);
            }
        }
        if(checked[0]){
            for(i=0;i<checked.length;i++){
                 makeRequest('/posts/'+checked[i]+'?_method=delete');
            };

            window.location.reload(true);
        } else{
            alert('선택된 글이 없습니다.');
        }
    } else{
        return;
    }
};
function makeRequest(url){
    var httpRequest;
    if(window.XMLHttpRequest){
        httpRequest = new XMLHttpRequest();
    } else if(window.ActiveXObject) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }

    if(!httpRequest){
        alert('gidsjkflew');
        return false;
    }
    httpRequest.onreadystatechange;
    httpRequest.open('POST', url);
    httpRequest.send();
}


// postview popup

var postView = document.getElementById("postView");
function onView() {
    document.body.style.overflow="hidden";
    postView.style.display="flex";
}

function exitView() {
    document.body.style.overflow="visible";
    postView.style.display="none";
}

// login button
