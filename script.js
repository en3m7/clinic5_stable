// ========================
// ОСНОВНОЙ JS ДЛЯ ВСЕХ СТРАНИЦ
// ========================

// ФУНКЦИЯ ОБНОВЛЕНИЯ КНОПОК АВТОРИЗАЦИИ
    function updateAuthButtons() {
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;
    
    const currentUser = JSON.parse(localStorage.getItem('lorCurrentUser'));
    
    if (currentUser) {
        authButtons.innerHTML = `
            <a href="profile.html" class="user-profile-btn">
                <i class="fas fa-user-circle"></i>
                <span>${currentUser.firstName} ${currentUser.lastName.charAt(0)}.</span>
            </a>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-secondary btn-sm">
                <i class="fas fa-sign-in-alt"></i> Войти
            </a>
            <a href="register.html" class="btn btn-primary btn-sm">
                <i class="fas fa-user-plus"></i> Регистрация
            </a>
        `;
    }
}


    document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт ЛОР-клиники загружен');
    
    // 0. ОБНОВЛЯЕМ КНОПКИ АВТОРИЗАЦИИ
    updateAuthButtons();
    
    // 1. БУРГЕР-МЕНЮ
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && !e.target.closest('.burger') && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    

    
    // 2. ПЕРЕКЛЮЧАТЕЛЬ ТЕМ
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Установка сохранённой темы
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Активация кнопки текущей темы
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        // Обработчик переключения
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            
            // Смена темы
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Обновление активной кнопки
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Анимация
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // 3. ВАЛИДАЦИЯ ТЕЛЕФОНА (если есть поле телефона)
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.startsWith('7') || value.startsWith('8')) {
                    value = '7' + value.substring(1);
                } else if (!value.startsWith('7')) {
                    value = '7' + value;
                }
                
                let formatted = '+7';
                if (value.length > 1) formatted += ' (' + value.substring(1, 4);
                if (value.length >= 4) formatted += ') ' + value.substring(4, 7);
                if (value.length >= 7) formatted += '-' + value.substring(7, 9);
                if (value.length >= 9) formatted += '-' + value.substring(9, 11);
                
                e.target.value = formatted.substring(0, 18);
            }
        });
    });
    
    // 4. ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРЕЙ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 5. ФИКСАЦИЯ ХЕДЕРА ПРИ ПРОКРУТКЕ
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'var(--shadow-md)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 6. АНИМАЦИЯ ПРИ СКРОЛЛЕ
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Анимируем карточки
    document.querySelectorAll('.service-card, .advantage-card, .doctor-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // 7. МОДАЛЬНЫЕ ОКНА (для страниц с кнопками консультации)
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие модальных окон
    modals.forEach(modal => {
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Закрытие при клике вне окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // 8. ОБРАБОТКА ФОРМ (базовая)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Базовая валидация
            const requiredInputs = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--danger)';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Имитация отправки
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Закрытие модального окна если оно есть
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }, 1500);
            }
        });
    });


    // ========================
    // СИСТЕМА РЕГИСТРАЦИИ И АВТОРИЗАЦИИ
    // ========================

    class AuthSystem {
        constructor() {
            this.currentUser = null;
            this.init();
        }
        
        init() {
            this.checkAuth();
            this.setupEventListeners();
        }
        
        // Проверка авторизации
        checkAuth() {
            const userData = localStorage.getItem('lorCurrentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.showUserProfile();
            }
        }
        
        // Настройка обработчиков
        setupEventListeners() {
            // Переключение между формами регистрации и входа
            document.getElementById('showLogin')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
            
            document.getElementById('showRegister')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
            
            // Форма регистрации
            document.getElementById('registerForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registerUser();
            });
            
            // Форма входа
            document.getElementById('loginForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.loginUser();
            });
            
            // Кнопки в профиле
            document.getElementById('makeAppointmentBtn')?.addEventListener('click', () => {
                window.location.href = 'appointment.html';
            });
            
            document.getElementById('logoutBtn')?.addEventListener('click', () => {
                this.logout();
            });
            
            // Валидация полей в реальном времени
            this.setupFieldValidation();
        }
        
        // Валидация полей
        setupFieldValidation() {
            // Фамилия - только кириллица
            const lastNameInput = document.getElementById('regLastName');
            if (lastNameInput) {
                lastNameInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^А-Яа-яЁё\s\-]/g, '');
                });
            }
            
            // Имя - только кириллица
            const firstNameInput = document.getElementById('regFirstName');
            if (firstNameInput) {
                firstNameInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^А-Яа-яЁё\s\-]/g, '');
                });
            }
            
            // Телефон - форматирование
            const phoneInput = document.getElementById('regPhone');
            if (phoneInput) {
                phoneInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    if (value.length > 0) {
                        if (value.startsWith('7') || value.startsWith('8')) {
                            value = '7' + value.substring(1);
                        } else if (!value.startsWith('7')) {
                            value = '7' + value;
                        }
                        
                        let formatted = '+7';
                        if (value.length > 1) formatted += ' (' + value.substring(1, 4);
                        if (value.length >= 4) formatted += ') ' + value.substring(4, 7);
                        if (value.length >= 7) formatted += '-' + value.substring(7, 9);
                        if (value.length >= 9) formatted += '-' + value.substring(9, 11);
                        
                        e.target.value = formatted.substring(0, 18);
                    }
                });
            }
            
            // Проверка совпадения паролей
            const passwordInput = document.getElementById('regPassword');
            const confirmInput = document.getElementById('regPasswordConfirm');
            if (passwordInput && confirmInput) {
                const checkPasswords = () => {
                    if (passwordInput.value !== confirmInput.value) {
                        confirmInput.style.borderColor = 'var(--danger)';
                        return false;
                    } else {
                        confirmInput.style.borderColor = '';
                        return true;
                    }
                };
                
                passwordInput.addEventListener('input', checkPasswords);
                confirmInput.addEventListener('input', checkPasswords);
            }
        }
        
        // Показать форму регистрации
        showRegisterForm() {
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('userProfile').style.display = 'none';
            document.getElementById('authMessage').style.display = 'none';
        }
        
        // Показать форму входа
        showLoginForm() {
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('userProfile').style.display = 'none';
            document.getElementById('authMessage').style.display = 'none';
        }
        
        // Показать профиль пользователя
        showUserProfile() {
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('userProfile').style.display = 'block';
            
            // Заполняем информацию о пользователе
            const userInfo = document.getElementById('userInfo');
            if (userInfo && this.currentUser) {
                userInfo.innerHTML = `
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 15px;">
                        <div style="font-weight: 500; color: #666;">Пациент:</div>
                        <div style="color: #1a5f9e; font-weight: 600;">
                            ${this.currentUser.lastName} ${this.currentUser.firstName} ${this.currentUser.middleName || ''}
                        </div>
                        
                        <div style="font-weight: 500; color: #666;">Телефон:</div>
                        <div>${this.currentUser.phone}</div>
                        
                        <div style="font-weight: 500; color: #666;">Email:</div>
                        <div>${this.currentUser.email}</div>
                        
                        <div style="font-weight: 500; color: #666;">Дата рождения:</div>
                        <div>${this.formatDate(this.currentUser.birthDate)}</div>
                    </div>
                `;
            }
            
            // Загружаем записи пользователя
            this.loadUserAppointments();
        }
        
        // Форматирование даты
        formatDate(dateString) {
            if (!dateString) return 'Не указана';
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU');
        }
        
        // Регистрация нового пользователя
        registerUser() {
            const form = document.getElementById('registerForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            // Проверка паролей
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regPasswordConfirm').value;
            
            if (password !== confirmPassword) {
                this.showMessage('Пароли не совпадают', 'error');
                return;
            }
            
            if (password.length < 6) {
                this.showMessage('Пароль должен быть не менее 6 символов', 'error');
                return;
            }
            
            // Проверка email на уникальность
            const email = document.getElementById('regEmail').value.toLowerCase();
            const existingUsers = JSON.parse(localStorage.getItem('lorUsers') || '[]');
            
            if (existingUsers.some(user => user.email === email)) {
                this.showMessage('Пользователь с таким email уже зарегистрирован', 'error');
                return;
            }
            
            // Создаём объект пользователя
            const user = {
                id: Date.now(),
                email: email,
                password: password, // В реальном проекте нужно хэшировать!
                lastName: document.getElementById('regLastName').value.trim(),
                firstName: document.getElementById('regFirstName').value.trim(),
                middleName: document.getElementById('regMiddleName').value.trim() || null,
                birthDate: document.getElementById('regBirthDate').value,
                phone: document.getElementById('regPhone').value,
                address: document.getElementById('regAddress').value.trim() || null,
                insurance: document.getElementById('regInsurance').value.trim() || null,
                registrationDate: new Date().toISOString()
            };
            
            // Сохраняем пользователя
            existingUsers.push(user);
            localStorage.setItem('lorUsers', JSON.stringify(existingUsers));
            
            // Авторизуем пользователя
            this.currentUser = user;
            localStorage.setItem('lorCurrentUser', JSON.stringify(user));
            
            // Показываем профиль
            this.showUserProfile();
            this.showMessage('Регистрация успешна! Добро пожаловать!', 'success');
            
            // Очищаем форму
            form.reset();
        }
        
        // Вход пользователя
        loginUser() {
            const email = document.getElementById('loginEmail').value.toLowerCase();
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                this.showMessage('Заполните все поля', 'error');
                return;
            }
            
            // Ищем пользователя
            const existingUsers = JSON.parse(localStorage.getItem('lorUsers') || '[]');
            const user = existingUsers.find(u => u.email === email && u.password === password);
            
            if (!user) {
                this.showMessage('Неверный email или пароль', 'error');
                return;
            }
            
            // Авторизуем пользователя
            this.currentUser = user;
            localStorage.setItem('lorCurrentUser', JSON.stringify(user));
            
            // Показываем профиль
            this.showUserProfile();
            this.showMessage('Вход выполнен успешно!', 'success');
            
            // Очищаем форму
            document.getElementById('loginForm').reset();
        }
        
        // Выход пользователя
        logout() {
            this.currentUser = null;
            localStorage.removeItem('lorCurrentUser');
            this.showRegisterForm();
            this.showMessage('Вы вышли из системы', 'info');
        }
        
        // Загрузка записей пользователя
        loadUserAppointments() {
            if (!this.currentUser) return;
            
            const appointmentList = document.getElementById('appointmentList');
            const noAppointments = document.getElementById('noAppointments');
            
            if (!appointmentList || !noAppointments) return;
            
            // Получаем записи из localStorage
            const appointments = JSON.parse(localStorage.getItem('lorAppointments') || '[]');
            const userAppointments = appointments.filter(app => 
                app.userId === this.currentUser.id || 
                app.email === this.currentUser.email
            );
            
            appointmentList.innerHTML = '';
            
            if (userAppointments.length === 0) {
                noAppointments.style.display = 'block';
                return;
            }
            
            noAppointments.style.display = 'none';
            
            // Сортируем по дате (сначала ближайшие)
            userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Выводим записи
            userAppointments.forEach(appointment => {
                const date = new Date(appointment.date);
                const formattedDate = date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long'
                });
                
                const appointmentDiv = document.createElement('div');
                appointmentDiv.className = 'appointment-item';
                appointmentDiv.style.cssText = `
                    padding: 15px;
                    margin-bottom: 10px;
                    background: var(--gray-100);
                    border-radius: 8px;
                    border-left: 4px solid var(--primary);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;
                
                appointmentDiv.innerHTML = `
                    <div>
                        <div style="font-weight: 600; color: var(--primary); margin-bottom: 5px;">
                            ${formattedDate} в ${appointment.time}
                        </div>
                        <div style="color: var(--gray-600); font-size: 14px;">
                            Врач: ${appointment.doctor?.name || 'Не указан'} | 
                            Услуги: ${appointment.services?.join(', ') || 'Не выбраны'}
                        </div>
                    </div>
                    <button class="btn-cancel" data-id="${appointment.id}" 
                            style="background: var(--danger); color: white; border: none; 
                                padding: 5px 10px; border-radius: 4px; cursor: pointer;
                                font-size: 12px;">
                        Отменить
                    </button>
                `;
                
                appointmentList.appendChild(appointmentDiv);
            });
            
            // Назначаем обработчики для кнопок отмены
            appointmentList.querySelectorAll('.btn-cancel').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const appointmentId = parseInt(e.target.dataset.id);
                    this.cancelAppointment(appointmentId);
                });
            });
        }
        
        // Отмена записи
        cancelAppointment(appointmentId) {
            if (!confirm('Вы уверены, что хотите отменить эту запись?')) {
                return;
            }
            
            // Получаем все записи
            const appointments = JSON.parse(localStorage.getItem('lorAppointments') || '[]');
            
            // Фильтруем удаляемую запись
            const updatedAppointments = appointments.filter(app => app.id !== appointmentId);
            
            // Сохраняем обновлённый список
            localStorage.setItem('lorAppointments', JSON.stringify(updatedAppointments));
            
            // Обновляем отображение
            this.loadUserAppointments();
            this.showMessage('Запись успешно отменена', 'success');
        }
        
        // Показать сообщение
        showMessage(text, type = 'info') {
            const messageDiv = document.getElementById('authMessage');
            if (!messageDiv) return;
            
            messageDiv.textContent = text;
            messageDiv.className = '';
            messageDiv.style.display = 'block';
            
            switch(type) {
                case 'success':
                    messageDiv.style.backgroundColor = '#d4edda';
                    messageDiv.style.color = '#155724';
                    messageDiv.style.border = '1px solid #c3e6cb';
                    break;
                case 'error':
                    messageDiv.style.backgroundColor = '#f8d7da';
                    messageDiv.style.color = '#721c24';
                    messageDiv.style.border = '1px solid #f5c6cb';
                    break;
                case 'info':
                    messageDiv.style.backgroundColor = '#d1ecf1';
                    messageDiv.style.color = '#0c5460';
                    messageDiv.style.border = '1px solid #bee5eb';
                    break;
            }
            
            // Автоматически скрыть через 5 секунд
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Инициализация системы при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('registration')) {
            window.authSystem = new AuthSystem();
        }
    });




    // В конец файла после класса AuthSystem добавь:

        // Обработка кнопок в хедере
        function updateHeaderAuth() {
            const currentUser = JSON.parse(localStorage.getItem('lorCurrentUser'));
            const loginBtn = document.getElementById('loginBtn');
            const registerBtn = document.getElementById('registerBtn');
            const profileBtn = document.getElementById('userProfileBtn');
            
            if (currentUser) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
                if (profileBtn) {
                    profileBtn.style.display = 'block';
                    // Добавляем имя пользователя
                    const userName = profileBtn.querySelector('.user-name');
                    if (!userName) {
                        profileBtn.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="color: var(--primary); font-weight: 500;">
                                    ${currentUser.firstName} ${currentUser.lastName.charAt(0)}.
                                </span>
                                <button class="btn btn-success btn-sm" onclick="window.location.href='profile.html'">
                                    <i class="fas fa-user-circle"></i> Профиль
                                </button>
                            </div>
                        `;
                    }
                }
            } else {
                if (loginBtn) loginBtn.style.display = 'block';
                if (registerBtn) registerBtn.style.display = 'block';
                if (profileBtn) profileBtn.style.display = 'none';
            }
        }

        // Обработчики кнопок
        document.addEventListener('DOMContentLoaded', () => {
            updateHeaderAuth();
            
            document.getElementById('loginBtn')?.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
            
            document.getElementById('registerBtn')?.addEventListener('click', () => {
                window.location.href = 'register.html';
            });
            
            // При изменении localStorage обновляем хедер
            window.addEventListener('storage', updateHeaderAuth);
        });



        updateAuthButtons();
    
            // Обновляем при изменении localStorage
            window.addEventListener('storage', updateAuthButtons);
        });

        // Экспортируем для использования на других страницах
        if (typeof window !== 'undefined') {
            window.updateAuthButtons = updateAuthButtons;
        
};