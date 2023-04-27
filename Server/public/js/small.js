const usernameExtractor= document.querySelector(".login-class")

usernameExtractor.addEventListener('submit', (e)=>{
    
    const username=e.target.elements.username.value
    sessionStorage.setItem("username",username)
})