let selectedEmail = 0;

let linkTrash = document.getElementById('linkTrash');
let linkInbox = document.getElementById('inbox');
let linkCompose = document.getElementById('compose');

linkTrash.addEventListener('click', function(e) {
    e.preventDefault();
    let filtered = games.filter( games => games.deleted);
    selectedEmail = 0;
    render(filtered);
});

linkInbox.addEventListener('click', function(e) {
    e.preventDefault();
    let inbox = games.filter(games => !games.deleted);
    selectedEmail = 0;
    render(inbox);
});

linkCompose.addEventListener('click', composeForm);

function composeForm(e) {
    e.preventDefault();
    let html_composeForm = `
    <div class="pure-g">
    <div class="pure-u-1">
        <form id="newemail"class="pure-form pure-form-aligned" name="newemail">
        <fieldset>
        <div class="pure-control-group">
        <label for="firstname">First Name</label>
        <input id="firstname" type="text" name="firstname">
        </div>

        <div class="pure-control-group">
        <label for="lastname">Last Name</label>
        <input id="last_name" type="text" name="lastname">
        </div>

        <div class="pure-control-group">
        <label for="subject">Subject</label>
        <input id="subject" type="text" name="subject">
        <span class="pure-form-message-inline"> This is a required field. </span>
        </div>

        <div class="pure-control-group">
        <label for="emailbody">Body</label>
        <textarea id="emailbody" name="emailbody" class="pure-input-1-2" rows="10" cols="200"></textarea>
        </div>

        <div class="pure-controls">
        <button id="send" type="submit" class="pure-button pure-button-primary"> Send </button>
        </div>

    </fieldset>
    </form>
    </div>
</div>
        
    `;
        let main = document.getElementById('main');
        main.innerHTML = html_composeForm;

        let send = document.getElementById('newemail');
        send.addEventListener('submit', function(e){
            e.preventDefault();

            let date = new Date();

            let obj_newEmail = {
                first_name : document.forms.newemail.firstname.value,
                last_name : document.forms.newemail.lastname.value,
                subject : document.forms.newemail.subject.value,
                body : document.forms.newemail.emailbody.value,
                date : date.toDateString(),
                time : date.toLocaleTimeString(),
                avatar : 'https://placem.at/people?h=50&w=50&random=1&txt=0'
            }
                games.unshift(obj_newEmail);

                setLocalStorage();

                linkInbox.click();
                
        });
}



function render(games) {

    let displayEmailSnippet = `
    ${games.map( (email, index) => `
        <div class="email-item pure-g" data-id="${index}">
        <div class="pure-u">
            <img width="64" height="64" alt="Tilo Mitra&#x27;s avatar" class="email-avatar" src="${email.avatar}">
        </div>

        <div class="pure-u-3-4">
            <h5 class="email-name">${email.first_name} ${email.last_name}</h5>
            <h4 class="email-subject">${email.subject}</h4>
            <p class="email-desc">
                ${email.body.length > 100 ? `$email.body.substr(0, 99)}...` : email.body }
            </p>
        </div>
        </div>
        `).join('') }

        `;

            let el = document.getElementById('list');
            el.innerHTML = displayEmailSnippet; 
            
           initialize(games);
            
        }

        function initialize(games) {
            let emailList = [...(document.querySelectorAll('[data-id]'))];
            emailList.map ( (email, index) => email.addEventListener('click', function(e) {
                emailList[selectedEmail].classList.remove('email-item-selected');
                email.classList.add('email-item-selected');
                selectedEmail = index ;
                showEmailBody(index, games);
            }));

            if(games.length) {
                emailList[selectedEmail].classList.add('email-item-selected');
                showEmailBody(selectedEmail, games);
            } else {
                let main = document.getElementById('main');
                main.innerHTML = '<h1 style="color: #aaa"> No Emails</h1>';
            }
        }

        function showEmailBody(idx, games) {
            let displayEmailBody = `
            <div class="email-content">
            <div class="email-content-header pure-g">
                <div class="pure-u-1-2">
                    <h1 class="email-content-title">${games[idx].subject}</h1>
                    <p class="email-content-subtitle">
                        From <a>${games[idx].publisher} ${games[idx].subject} </a> at <span>${games[idx].time}, 
                        ${games[idx].date} </span>
                    </p>
                </div>
    
                <div class="email-content-controls pure-u-1-2">
                    <button id="delete" class="secondary-button pure-button ${games[idx].deleted ? 'btn-pressed' : ''}" data-id="${idx}">${games[idx].deleted ? 'Deleted' : 'Delete'}</button>
                    <button class="secondary-button pure-button">Forward</button>
                    <button class="secondary-button pure-button">Move to</button>
                </div>
            </div>
    
            <div class="email-content-body">
                <p>
                ${games[idx].body}
                </p>
            </div>
                    <div>
                    <iframe width=1000 height=500 seamless src ="${games[idx].ifrmSrc}">
                    </div>
        </div>
            
            `;

            let main = document.getElementById('main');
            main.innerHTML = displayEmailBody;

            let btn_delete = document.getElementById('delete');
            btn_delete.addEventListener('click', () => deleteGames(btn_delete.dataset.id, games));
            
        }

        function deleteGames(index, games) {
            if(!games[index].deleted){
                games[index].deleted = true;

                setLocalStorage();

                let inbox = games.filter(games => !games.deleted);
                selectedEmail = 0;
                render(inbox);
            } else{
                delete games[index].deleted;
                let filtered = games.filter( games => games.deleted);
                selectedEmail = 0;
                render(filtered);
            }
            
        }

        function setLocalStorage() {
            localStorage.setItem('items', JSON.stringify(games));
        }

       

        if (localStorage.getItem('items')) {
            games = JSON.parse(localStorage.getItem('items'));
            let filtered = games.filter(games => !games.deleted);
            render(filtered);

        } else {
        render(games); 
        } 


       