document.addEventListener('DOMContentLoaded', (event) => {

    var loginform = document.querySelector('.login_form');
    if (loginform) {
        btn = loginform.querySelector('.btn');
        btn.addEventListener('click', async e => {
            var alert = loginform.querySelector('.alert');
            var email = loginform.querySelector('#email').value;
            var password = loginform.querySelector('#password').value;
            const val = await axios.post('/api/v1/user/signin', {
                email, password
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
                alert.innerHTML = 'Incorrect !!!';
            }
        })
    }

});