const outputMessage = (data, list_user, type) => {
    var message_list = document.querySelector('.message-list');
    var outputDom = `<div class="message_item"><span class="message_item_left">${data.text}</span></div>`
    if (type == 'receive') {
        const result = list_user.data.data.find(user => user._id === data.user_from);
        outputDom = `<div class="message_item"><img src="/img/${result.photo}" alt=""><span class="message_item_right">${data.text}</span></div>`
    }
    message_list.insertAdjacentHTML('beforeend', outputDom);
    message_list.scrollTop = message_list.scrollHeight;
}
document.addEventListener('DOMContentLoaded', async (event) => {
    // logout
    const btn = document.querySelector('.nav__el--logout');
    if (btn) {
        btn.addEventListener('click', async e => {
            const val = await axios.get('/api/v1/user/logout')
            if (val.data.status == 'success') {
                location.href = '/login';
            }
        })
    }
    // Add button
    const form_edu = document.querySelectorAll('.btn__form--bonus');
    if (form_edu) {
        var aboutbonus = '<div class="form__group-arr"><input class="form__input" type="text" name="title" value="" placeholder="Title(ex: TOEIC)" required="required" /><input class="form__input" type="text" name="description" value="" placeholder="Description(ex: 500)" required="required" /></div>'
        var accomplishment = '<div class="form__group-arr"><input class="form__input" type="text" name="num" value="" placeholder="ex: first prize" required="required" /><input class="form__input" type="text" name="type" value="" placeholder="ex: scientific research 2020" required="required" /></div>'
        var experiance = '<div class="form__group-arr"><input class="form__input" type="text" name="name" value="" placeholder="Name (ex: Math)" required="required" /><input class="form__input" type="text" name="percent" value="" placeholder="Percent (ex: 70%)" required="required" /></div>'
        var education = '<div class="form__group-arr3 form__group-arr3"><input class="form__input" type="text" name="year" value="" placeholder="Year" required="required" /><input class="form__input" type="text" name="title" value="" placeholder="Title" required="required" /><input class="form__input" type="text" name="description" value="" placeholder="Description" required="required" /></div>'
        form_edu.forEach(ele => {
            ele.addEventListener('click', e => {
                eleArr = ele.parentNode;
                switch (eleArr.getAttribute('id')) {
                    case 'aboutbonus':
                        ele.insertAdjacentHTML('afterend', aboutbonus);
                        break;
                    case 'accomplishment':
                        ele.insertAdjacentHTML('afterend', accomplishment);
                        break;
                    case 'experiance':
                        ele.insertAdjacentHTML('afterend', experiance);
                        break;
                    case 'education':
                        ele.insertAdjacentHTML('afterend', education);
                        break;

                    default:
                        break;
                }
                if (eleArr.getAttribute('id') == 'aboutbonus') {
                }
            })
        })
    }
    // Form setUserPage
    var formSetUser = document.querySelector('.form-set-user');
    if (formSetUser) {
        var button = formSetUser.querySelector('button');
        button.addEventListener('click', async e => {
            e.preventDefault();
            var alert = document.querySelector('.alert');
            var form = new FormData;
            form.append('name', document.getElementById('name').value);
            form.append('email', document.getElementById('email').value);
            form.append('color', document.getElementById('color').value);
            form.append('photo', document.getElementById('photo').files[0]);
            form.append('background', document.getElementById('backgroudphoto').files[0]);
            const value = await axios.patch('api/v1/user/update_user', form);
            console.log(value)
            if (value.data.status == 'success') {
                alert.classList.add('alert-success');
                alert.classList.remove('alert-danger');
                alert.innerHTML = 'successfull !!!';
            } else {
                alert.classList.add('alert-danger');
                alert.classList.remove('alert-success');
                alert.innerHTML = 'Fail !!!';
            }
        })
    }
    // Form cv
    var formUpploadCv = document.querySelector('.form-upload-cv');
    if (formUpploadCv) {
        var button = formUpploadCv.querySelector('button');
        button.addEventListener('click', async e => {
            e.preventDefault();
            var alert = document.querySelector('.alert');
            var form = new FormData;
            form.append('cv', document.getElementById('cv').files[0])
            const value = await axios.patch('api/v1/user/update_user_cv', form);
            if (value.data.status == 'success') {
                alert.classList.add('alert-success');
                alert.classList.remove('alert-danger');
                alert.innerHTML = 'successfull !!!';
            } else {
                alert.classList.add('alert-danger');
                alert.classList.remove('alert-success');
                alert.innerHTML = 'Fail !!!';
            }
        })
    }
    // Form setInforPage
    var formSetInfor = document.querySelector('.form-set-infor');
    if (formSetInfor) {
        var button = formSetInfor.querySelector('button');
        button.addEventListener('click', async e => {
            e.preventDefault();
            var alert = document.querySelector('.alert');
            var obj = {};
            obj.age = document.getElementById('age').value;
            obj.phone = document.getElementById('phone').value;
            obj.address = document.getElementById('address').value;
            obj.socialNetwork = document.getElementById('socialNetwork').value;
            obj.intro = document.getElementById('intro').value;

            const value = await axios.patch('api/v1/user/update_infor', obj);
            if (value.data.status == 'success') {
                alert.classList.add('alert-success');
                alert.classList.remove('alert-danger');
                alert.innerHTML = 'successfull !!!';
            } else {
                alert.classList.add('alert-danger');
                alert.classList.remove('alert-success');
                alert.innerHTML = 'Fail !!!';
            }
        })
    }
    // Form setEduPage
    var formSetedu = document.querySelector('.form-set-edu');
    if (formSetedu) {
        var button = formSetedu.querySelector('button.btn--green');
        button.addEventListener('click', async e => {
            e.preventDefault();
            var alert = document.querySelector('.alert');
            var obj = {};
            obj.qualification = document.getElementById('qualification').value;
            obj.post = document.getElementById('post').value;
            obj.language = document.getElementById('language').value;

            var aboutbonus = document.getElementById('aboutbonus');
            var arrAboutbonusTitle = aboutbonus.querySelectorAll("input[name='title']");
            var arrAboutbonusDescription = aboutbonus.querySelectorAll("input[name='description']");
            obj.aboutBonus = [];
            for (let i = 0; i < arrAboutbonusTitle.length; i++) {
                var temp = {
                    title: arrAboutbonusTitle[i].value,
                    description: arrAboutbonusDescription[i].value

                }
                obj.aboutBonus.push(temp);
            }

            var accomplishment = document.getElementById('accomplishment');
            var arraccomplishmentnum = accomplishment.querySelectorAll("input[name='num']");
            var arraccomplishmenttype = accomplishment.querySelectorAll("input[name='type']");
            obj.accomplishment = [];
            for (let i = 0; i < arraccomplishmentnum.length; i++) {
                var temp = {
                    num: arraccomplishmentnum[i].value,
                    type: arraccomplishmenttype[i].value
                }
                obj.accomplishment.push(temp);
            }

            var experiance = document.getElementById('experiance');
            var arrexperiancename = experiance.querySelectorAll("input[name='name']");
            var arrexperiancepercent = experiance.querySelectorAll("input[name='percent']");
            obj.experiance = [];
            for (let i = 0; i < arrexperiancename.length; i++) {
                var temp = {
                    name: arrexperiancename[i].value,
                    percent: arrexperiancepercent[i].value

                }
                obj.experiance.push(temp);
            }

            var education = document.getElementById('education');
            var arreducationyear = education.querySelectorAll("input[name='year']");
            var arreducationtitle = education.querySelectorAll("input[name='title']");
            var arreducationdescription = education.querySelectorAll("input[name='description']");
            obj.education = [];
            for (let i = 0; i < arreducationyear.length; i++) {
                var temp = {
                    year: arreducationyear[i].value,
                    title: arreducationtitle[i].value,
                    description: arreducationdescription[i].value
                }
                obj.education.push(temp);
            }
            const value = await axios.patch('api/v1/edu/update_edu', obj);
            if (value.data.status == 'success') {
                alert.classList.add('alert-success');
                alert.classList.remove('alert-danger');
                alert.innerHTML = 'successfull !!!';
            } else {
                alert.classList.add('alert-danger');
                alert.classList.remove('alert-success');
                alert.innerHTML = 'Fail !!!';
            }
        })
    }
    // Form signup
    const formSignup = document.querySelector('.form--signup');
    if (formSignup) {
        var button = formSignup.querySelector('.btn');
        button.addEventListener('click', async e => {
            var alert = document.querySelector('.alert');
            var email = formSignup.querySelector('#email').value;
            var name = formSignup.querySelector('#name').value;
            var password = formSignup.querySelector('#password').value;
            var passwordConfirm = formSignup.querySelector('#passwordConfirm').value;

            const val = await axios.post('/api/v1/user/signup', {
                name, email, password, passwordConfirm
            })
            if (val.data.status == 'success') {
                alert.classList.add('alert-success');
                alert.classList.remove('alert-danger');
                alert.innerHTML = 'successfull';
                setTimeout(e => {
                    location.href = '/get_me';
                }, 3000)
            } else {
                alert.classList.add('alert-danger');
                alert.classList.remove('alert-success');
                alert.innerHTML = 'Fail !!!';
            }
        })
    }
    const chatRealTime = document.querySelector('.chat-real-time');
    if (chatRealTime) {
        var id_user_current = document.getElementById('id-user-current').getAttribute('data-id');
        var list_ul = chatRealTime.querySelector('.side-nav');

        var list_user = await axios.get(`/api/v1/message/${id_user_current}`);
        if (list_user.data.status == 'success') {
            list_user.data.data.forEach(ele => {
                var htmlString = `<li><a href="" data-user="${ele._id}"><img src="/img/${ele.photo}" alt=""> ${ele.name}</a></li>`
                list_ul.insertAdjacentHTML('beforeend', htmlString)
            })
        }


        const socket = io();
        //emit user_id and socket_id
        socket.emit('send_user_id', {
            userid: id_user_current
        })
        var list_item = chatRealTime.querySelectorAll('.side-nav li a');
        list_item.forEach(ele => {
            ele.addEventListener('click', async e => {
                e.preventDefault();
                // show block
                document.querySelector('.chat-view__content').classList.remove('chat-view__content_none');
                // active
                user_id_to = ele.getAttribute('data-user');
                list_ul.querySelectorAll('li').forEach(ele => {
                    ele.classList.remove('side-nav--active')
                })
                ele.parentElement.classList.add('side-nav--active');
                // set name title
                document.getElementById('name_user_chat').innerHTML = ele.textContent;
                //get message with user
                var message_list_DOM = document.querySelector('.message-list');
                message_list_DOM.innerHTML = '';
                var msgs = await axios.get(`/api/v1/message/getmessages/${user_id_to}`);
                msgs.data.data.forEach(eleinsert => {

                    if (eleinsert.toUser == id_user_current) {
                        const result = list_user.data.data.find(user => user._id === eleinsert.fromUser);
                        message_list_DOM.insertAdjacentHTML('beforeend', `<div class="message_item"><img src="/img/${result.photo}" alt=""><span class="message_item_right">${eleinsert.text}</span></div>`)
                    } else {
                        message_list_DOM.insertAdjacentHTML('beforeend', `<div class="message_item"><span class="message_item_left">${eleinsert.text}</span></div>`)
                    }
                })
                message_list_DOM.scrollTop = message_list_DOM.scrollHeight;
                var btn_submit = document.querySelector('#btn-submit');
                document.getElementById('message').addEventListener('keypress', function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        btn_submit.click();
                    }
                })
                btn_submit.addEventListener('click', (e) => {
                    e.preventDefault();
                    var msg = document.querySelector('#message').value;
                    data = {
                        text: msg,
                        user_from: id_user_current,
                        user_to: user_id_to
                    };
                    socket.emit('chatMessagePrivate', data);
                    outputMessage(data, list_user, 'send');
                    document.querySelector('#message').value = '';
                    document.querySelector('#message').focus();
                })
            })
        })
        socket.on('send-request-join-room', data => {
            socket.emit('accept-request-join-room', data)
        })
        // receive message from broadcast
        socket.on('messagePrivate', (data) => {
            outputMessage(data, list_user, 'receive');
        })
    }
    const nav__search = document.querySelector('.nav__portfolio');
    if (nav__search) {
        nav__search.querySelector('input').addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                nav__search.querySelector('button').click();
            }
        })
        nav__search.querySelector('button').addEventListener('click', e => {
            e.preventDefault();
            var text = nav__search.querySelector('input').value;
            location.href = `/search?searchField=${text}`;
        })
    }
    const main_seach_page = document.querySelector('.main-seach-page')
    if (main_seach_page) {
        var btn_with_chat = main_seach_page.querySelectorAll('.btn-with-chat');
        btn_with_chat.forEach(ele => {
            ele.addEventListener('click', async e => {
                e.preventDefault();
                var value = await axios.post('/api/v1/message/saveMessage', {
                    toUser: ele.getAttribute('data-id'),
                    text: 'Hello'
                })
                if (value.data.status == 'success') {
                    location.href = '/message';
                } else {
                    alert('Bạn chưa đăng nhập');
                }
            })
        })
    }
    var user_info = document.querySelector('.user_info');
    if (user_info) {
        var contactMe = user_info.querySelector('.contactMe');
        contactMe.querySelector('button').addEventListener('click', async e => {
            e.preventDefault();
            var value = await axios.post('/api/v1/message/saveMessage', {
                toUser: contactMe.querySelector('button').getAttribute('data-id'),
                text: contactMe.querySelector('textarea').value
            })
            if (value.data.status == 'success') {
                location.href = '/message';
            } else {
                alert('Bạn chưa đăng nhập');
            }
        })
    }
});
