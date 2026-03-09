const API_BASE = "http://localhost:5000/api";

document.getElementById("authForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;

    try{

        const res = await fetch(`${API_BASE}/hr/login`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:userId,
                password:password
            })
        });

        const data = await res.json();
console.log("LOGIN RESPONSE:", data);

        if(res.ok){

            localStorage.setItem("token", data.token);

if (data.user) {
    localStorage.setItem("userId", data.user._id);
    localStorage.setItem("companyId", data.user.companyId);
} else {
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("companyId", data.companyId);
}

            window.location.href="/Healthlink/Solutions/corp_sol/hr_page.html";

        }else{

            alert(data.message || "Login failed");

        }

    }catch(err){

        console.error(err);
        alert("Server error");

    }

});