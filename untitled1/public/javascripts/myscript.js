document.addEventListener('DOMContentLoaded', async () => {
    const name = document.getElementById("insert")
    const listrepos = document.getElementById("listrepos")
    const listfllowers = document.getElementById("listfllowers")
    const err= document.getElementById("warning")
    const noRepose =document.getElementById("no_repos")
    const usermane =document.getElementById("nameuser")
    const noFollow =document.getElementById("no_follow")
    const listsave= document.getElementById("saved")
    document.getElementById('search').addEventListener('click', async () => {
        deleteerror()
        resetLists()

        let address = 'https://api.github.com/users/' + (name.value)

        arrrepos = []
        arrfollowers = []
        if(nameError(name.value))
            return

        try {
            const res = await fetch(address)
            const json = await res.json()
            if (res.status=='404')
            {
                userNotExistMessage()
                return
            }
            showUserName()
            const public_repos = json.public_repos
            const repos_url = json.repos_url
            const num_followers = json.followers
            const followers_url = json.followers_url

            try {
                const urls_repos = await fetch(repos_url)
                const repos = await urls_repos.json()
                listrepos.parentElement.style.display = "block"
                if (public_repos == 0) {

                    noRepose.innerText = "No reposetories"
                    noRepose.style.display = "block"

                } else {
                    for (i of repos) {
                        arrrepos.push({name: i.name, url: i.html_url})

                    }
                    for (const {name, url} of arrrepos) {
                        const menuItem = generateMenuItem({name, url})
                        const revach = document.createElement('br')
                        listrepos.appendChild(menuItem)
                        listrepos.appendChild(revach)
                        listrepos.style.display = "block"

                    }
                }
            } catch (error) {
                console.error('Failed to fetch or parse reposetories', error)
                err.innerText = "Failed to fetch or parse reposetories"
                err.style.display = 'block'
            }

            try {

                const urls_followers = await fetch(followers_url)
                const followers = await urls_followers.json()
                listfllowers.parentElement.style.display = "block"
                if (num_followers ==0){

                    noFollow.innerText = "No Followers"
                    noFollow.style.display ="block"

                }
                else {
                    for (i of followers) {
                        arrfollowers.push({name: i.login, url: i.html_url})
                    }


                    for (const {name, url} of arrfollowers) {
                        const menuItem = generateMenuItem({name, url})
                        const revach = document.createElement('br')
                        listfllowers.appendChild(menuItem)
                        listfllowers.appendChild(revach)
                        listfllowers.style.display = "block"

                    }
                }
            } catch (error) {
                //console.error('Failed to fetch or parse followers', error)
                console.error('no such user', error)


            }
        } catch (e) {
            console.error('no such user', error)

            err.innerText="no such user"
            err.style.display= 'block'

        }
    })
    document.getElementById("save").addEventListener('click', async () => {
        let address = 'https://api.github.com/users/' + (name.value)
        let save_address = '/users/save'
        deleteerror()
        try {
            const res = await fetch(address)
            if (res.status=='404')
            {
                userNotExistMessage()
                return
            }
            while (listsave.firstChild) {
                listsave.removeChild(listsave.firstChild);
            }
            const json = await res.json()
            const name = json.login
            const url = json.html_url
            const data = ({name: name, url: url})
            showUserName()
            try {
                const result = await fetch(save_address, {
                    method: 'POST', body: JSON.stringify(data),
                    headers: {'Content-Type': 'application/Json'}
                })

                // listsave.parentElement.style.display = "block"
                const j = await result.json()
                err.innerText=j.message
                err.style.display= 'block'
                usermane.style.display='none'
                for(let i of j.list){

                    const menuItem = generateMenuItem({name:i.name,url: i.url})
                    const revach = document.createElement('br')
                    listsave.appendChild(menuItem)
                    listsave.appendChild(revach)
                    listsave.style.display = "block"
                }
            } catch (e) {
                console.error('no connention to server', e)
            }
        } catch (error) {
            err.innerText="no such user"
            err.style.display= 'block'
        }
    })
    document.getElementById("delete").addEventListener('click', async () =>  {
        let address = 'https://api.github.com/users/' + (name.value)
        let delete_address = '/users/delete'
        while (listsave.firstChild) {
            listsave.removeChild(listsave.firstChild);
        }
        try {
            const res = await fetch(address)
            const json = await res.json()
            const name = json.login
            const url = json.html_url
            const data= ({name: name, url: url})
            try {
                const result = await fetch(delete_address, {method: 'POST', body: JSON.stringify(data),
                    headers: { 'Content-Type':'application/Json'}})
                const j = await result.json()
                err.innerText=j.message
                err.style.display= 'block'
                usermane.style.display='none'

                for(let i of j.list){

                    const menuItem = generateMenuItem({name:i.name,url: i.url})
                    const revach = document.createElement('br')
                    listsave.appendChild(menuItem)
                    listsave.appendChild(revach)
                    listsave.style.display = "block"

                }
            }
            catch (e) {
                console.error('no connention to server', e)
            }
        }
        catch (error) {
            console.error('no such user', error)
        }
    })

    const deleteerror=()=>{
        err.style.display='none'
        noRepose.style.display ='none'
        noFollow.style.display = 'none'
        usermane.style.display="none"
    }
    const generateMenuItem = ({name, url}) => {
        const menuItem = document.createElement('a')
        menuItem.classList.add('action')
        menuItem.href = url
        menuItem.target = "_blank"
        menuItem.innerHTML = name
        return menuItem
    }

    const showUserName = () => {
        usermane.innerText=name.value
        usermane.style.display ="block"
    }

    const resetLists=()=>{
        deleteerror()
        while (listrepos.firstChild) {
            listrepos.removeChild(listrepos.firstChild);
        }
        while (listfllowers.firstChild) {
            listfllowers.removeChild(listfllowers.firstChild);
        }
    }
    const nameError= (name) =>{
        if(name=="")
        {
            err.innerText="no input"
            err.style.display= 'block'
            return true
        }
    }
    const userNotExistMessage = () =>{
        err.innerText="no such user"
        err.style.display= 'block'
        listrepos.parentElement.style.display = "none"
        listfllowers.parentElement.style.display = "none"
    }

})

