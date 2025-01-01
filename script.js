import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase,ref,push,onValue,remove,set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
const appSetting ={
    databaseURL:"https://js-crud-55f1b-default-rtdb.firebaseio.com/",
};

const app=initializeApp(appSetting);
const database=getDatabase(app);
const usersListInDB=ref(database,"users");

const idEl=document.querySelector("#id");
const nameEl=document.querySelector("#name");
const ageEl=document.querySelector("#age");
const cityEl=document.querySelector("#city");
const frm=document.querySelector("#frm");
const tblBodyEl=document.querySelector("#tblBody");
frm.addEventListener("submit",function(e){
    e.preventDefault();
    if(idEl.value){
        set(ref(database,"users/"+idEl.value),{
            name:nameEl.value.trim(),
            age:ageEl.value.trim(),
            city:cityEl.value.trim(),
        });
        clearAllDetails();
        return;
    }
    if(!nameEl.value.trim() || !cityEl.value.trim() || !ageEl.value.trim()){
        alertF();
        return;
    }
    const newUser={
        name:nameEl.value.trim(),
        age:ageEl.value.trim(),
        city:cityEl.value.trim(),
    };
    push(usersListInDB,newUser);
    clearAllDetails();
});

function clearAllDetails(){
    nameEl.value="";
    ageEl.value="";
    cityEl.value="";
    idEl.value="";
}

onValue(usersListInDB,(snapshot)=>{
    if(snapshot.exists()){
        let itemar=Object.entries(snapshot.val());
        tblBodyEl.innerHTML="";
        for(let i=0;i<itemar.length;i++){

            let currentUser=itemar[i];
            let currentUserId=currentUser[0];
            let currentUserValue=currentUser[1];
            
            let currentTr=document.createElement('tr');
            currentTr.innerHTML=`
                <td>${i+1}</td>
                <td>${currentUserValue.name}</td>
                <td>${currentUserValue.age}</td>
                <td>${currentUserValue.city}</td>
                <td><button class="btn-edit" data-id="${currentUserId}"><ion-icon name="create"></ion-icon></button></td>
                <td><button class="btn-delete" data-id="${currentUserId}"><ion-icon name="trash"></ion-icon></button></td>        
            `;
            tblBodyEl.append(currentTr);
        }
    }
    else{
        tblBodyEl.innerHTML=`<tr><td colspan='6'>No Record Found!</td></tr>`
    }
});


document.addEventListener('click',(e)=>{
    if(e.target.classList.contains("btn-edit")){
        const id=e.target.dataset.id;
        const tdElements= e.target.closest('tr').children;
        idEl.value=id;
        nameEl.value=tdElements[1].textContent;
        ageEl.value=tdElements[2].textContent;
        cityEl.value=tdElements[3].textContent;
    }
    else if(e.target.classList.contains("btn-delete")){
        let id=e.target.dataset.id;
        let data=ref(database,`users/${id}`);
        deleteF(data);
    }
});



const popup=document.querySelector('.popup');
const popup_delete=document.querySelector('.popup-delete');
const popup_alert=document.querySelector('.popup-alert');
const delete_close=document.querySelector(".popup-close");

function deleteF(data){
    popup.style.display="flex";
    popup_alert.style.display="none";
    popup_delete.style.display="flex";
    const delete_conf=document.querySelector("#delete-conf");
    delete_conf.addEventListener('click',function(){
        popup.style.display="none";
        remove(data);
    });
    delete_close.addEventListener('click',()=>{
        popup.style.display="none";
        data=0;
    });
};
function alertF(){
    popup.style.display="flex";
    popup_delete.style.display="none";
    popup_alert.style.display="flex";
    const alert=document.querySelector("#alert");
    alert.addEventListener('click',function(){
        popup.style.display="none";
    });
};