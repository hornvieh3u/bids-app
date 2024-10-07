let alertTimer;

document.querySelector("#toggle-mode").addEventListener("change", async (e) => {
    await window.darkMode.toggle(e.target.value)
})

document.querySelector("#save").addEventListener("click", async () => {
    let bidData = {
        client_username:    document.querySelector("#client-username").value,
        client_country:     document.querySelector("#client-country").value,
        client_timezone:    document.querySelector("#client-timezone").value,
        client_call_time:   document.querySelector("#client-call-time").value,
        client_job:         document.querySelector("#client-job").value,
        chat_platform_id:   document.querySelector("#platforms").value,
        chat_server:        document.querySelector("#chat-server").value,
        comment:            document.querySelector("#comment").value,
    };
    clearFormValues();
    let result = await window.bidData.save(bidData);
    showAlert(result ? "Success!" : "Fail");
})

document.querySelector("#cancel").addEventListener("click", clearFormValues)

function clearFormValues() {
    document.querySelector("#client-username").value = ""
    document.querySelector("#client-country").value = ""
    document.querySelector("#client-timezone").value = ""
    document.querySelector("#client-call-time").value = ""
    document.querySelector("#client-job").value = ""
    document.querySelector("#chat-server").value = ""
    document.querySelector("#comment").value = ""
}

function showAlert(message) {
    document.querySelector(".alert").innerHTML = message;
    document.querySelector(".alert").style.visibility = "visible";
    if (alertTimer) clearTimeout(alertTimer);
    alertTimer = setTimeout(() => { document.querySelector(".alert").style.visibility = "hidden"; }, 3000);
}