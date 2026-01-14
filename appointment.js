// ========================
// JS ДЛЯ СТРАНИЦЫ ЗАПИСИ
// ========================

class AppointmentSystem {
    constructor() {
        this.currentStep = 1;
        this.selectedDoctor = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.selectedServices = [];
        this.appointmentData = {};
        
        // Данные врачей (НОРМАЛЬНЫЙ ГРАФИК!)
        this.doctors = {
            'ivanov': {
                id: 'ivanov',
                name: 'Иванов А. В.',
                fullName: 'Иванов Алексей Владимирович',
                specialty: 'ЛОР-хирург высшей категории',
                workingDays: [1, 2, 4, 5], // Пн, Вт, Чт, Пт
                workingHours: ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'],
                offDays: [3, 6, 0],
                workingDaysText: 'Пн, Вт, Чт, Пт',
                workingHoursText: '9:00 - 18:00',
                experience: '25 лет',
                degree: 'Д.м.н.'
            },
            'petrova': {
                id: 'petrova',
                name: 'Петрова Е. С.',
                fullName: 'Петрова Елена Сергеевна',
                specialty: 'Детский ЛОР, к.м.н.',
                workingDays: [3, 4, 5, 6], // Ср, Чт, Пт, Сб (НОРМАЛЬНО!)
                workingHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
                offDays: [0, 1, 2],
                workingDaysText: 'Ср, Чт, Пт, Сб',
                workingHoursText: '10:00 - 17:00',
                experience: '18 лет',
                degree: 'К.м.н.'
            }
        };
        
        // Цены услуг
        this.servicePrices = {
            'Консультация ЛОРа': 2500,
            'Видеоэндоскопия': 1800,
            'Аудиометрия': 1500,
            'Детский приём': 2800
        };
        
        this.init();
    }
    
    // Инициализация системы
    init() {
        this.setupUserData();
        this.setupEventListeners();
        this.showStep(1);
        this.updatePriceSummary();
        this.setupInputValidators();
    }
    
    setupUserData() {
        const currentUser = JSON.parse(localStorage.getItem('lorCurrentUser'));
        
        if (currentUser) {
            const fullNameInput = document.getElementById('fullName');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');
            const birthDateInput = document.getElementById('birthDate');
            
            if (fullNameInput) {
                fullNameInput.value = `${currentUser.lastName} ${currentUser.firstName} ${currentUser.middleName || ''}`.trim();
            }
            
            if (phoneInput && currentUser.phone) {
                phoneInput.value = currentUser.phone;
            }
            
            if (emailInput && currentUser.email) {
                emailInput.value = currentUser.email;
            }
            
            if (birthDateInput && currentUser.birthDate) {
                birthDateInput.value = currentUser.birthDate;
            }
            
            this.appointmentData.userId = currentUser.id;
            this.appointmentData.email = currentUser.email;
        }
    }
    
    // Настройка валидаторов
    setupInputValidators() {
        // ФИО
        const fullNameInput = document.getElementById('fullName');
        if (fullNameInput) {
            fullNameInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^а-яА-ЯёЁ\s\-]/g, '');
            });
            
            fullNameInput.addEventListener('blur', (e) => {
                const value = e.target.value.trim();
                if (value && value.split(' ').length < 2) {
                    this.showInputError(fullNameInput, 'Введите Фамилию Имя Отчество');
                } else {
                    this.clearInputError(fullNameInput);
                }
            });
        }
        
        // Телефон
        const phoneInput = document.getElementById('phone');
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
            
            phoneInput.addEventListener('blur', (e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length !== 11) {
                    this.showInputError(phoneInput, 'Введите 11 цифр номера');
                } else {
                    this.clearInputError(phoneInput);
                }
            });
        }
        
        // Email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                const value = e.target.value.trim();
                if (value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        this.showInputError(emailInput, 'Введите корректный email');
                    } else {
                        this.clearInputError(emailInput);
                    }
                }
            });
        }
        
        // Дата рождения
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput) {
            const today = new Date().toISOString().split('T')[0];
            birthDateInput.max = today;
        }
    }
    
    // Показать ошибку
    showInputError(inputElement, message) {
        this.clearInputError(inputElement);
        inputElement.style.borderColor = 'var(--danger)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.style.color = 'var(--danger)';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        inputElement.parentNode.appendChild(errorDiv);
    }
    
    // Убрать ошибку
    clearInputError(inputElement) {
        inputElement.style.borderColor = '';
        const existingError = inputElement.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Настройка обработчиков
    setupEventListeners() {
        // Выбор врача
        document.querySelectorAll('.select-doctor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const doctorId = btn.dataset.doctor;
                this.selectDoctor(doctorId);
            });
        });
        
        // Навигация
        document.getElementById('nextStep2')?.addEventListener('click', () => this.goToStep(3));
        document.getElementById('nextStep3')?.addEventListener('click', () => this.goToStep(4));
        
        document.getElementById('prevStep1')?.addEventListener('click', () => this.goToStep(1));
        document.getElementById('prevStep2')?.addEventListener('click', () => this.goToStep(2));
        document.getElementById('prevStep3')?.addEventListener('click', () => this.goToStep(3));
        
        // Отправка
        document.getElementById('submitAppointment')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitAppointment();
        });
        
        // Обновление стоимости
        document.querySelectorAll('input[name="service"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updatePriceSummary());
        });
    }
    
    // Показать шаг
    showStep(stepNumber) {
        document.querySelectorAll('.step-card, #resultStep').forEach(el => {
            el.style.display = 'none';
        });
        
        if (stepNumber === 'result') {
            document.getElementById('resultStep').style.display = 'block';
        } else {
            document.getElementById(`step${stepNumber}`).style.display = 'block';
            this.currentStep = stepNumber;
        }
        
        this.updateProgressBar(stepNumber);
    }
    
    // Обновление прогресс бара
    updateProgressBar(stepNumber) {
        if (stepNumber === 'result') return;
        
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById(`step${i}-progress`);
            if (i < stepNumber) {
                stepElement.classList.add('completed');
            } else if (i == stepNumber) {
                stepElement.classList.add('active');
            }
        }
    }
    
    // Выбор врача
    selectDoctor(doctorId) {
        this.selectedDoctor = doctorId;
        
        document.querySelectorAll('.doctor-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`.doctor-card[data-doctor="${doctorId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.appointmentData.doctor = doctorId;
        
        setTimeout(() => {
            this.goToStep(2);
        }, 300);
    }
    
    // Переход к шагу
    goToStep(nextStep) {
        if (nextStep === 3 && (!this.selectedDate || !this.selectedTime)) {
            alert('Выберите дату и время приёма');
            return;
        }
        
        if (nextStep === 4 && this.currentStep === 3) {
            this.updateAppointmentSummary();
        }
        
        if (nextStep === 2 && this.currentStep === 1) {
            this.generateDatePicker();
            this.updateDoctorInfo();
        }
        
        this.showStep(nextStep);
    }
    
    // Обновление информации о враче
    updateDoctorInfo() {
        if (!this.selectedDoctor) return;
        
        const doctor = this.doctors[this.selectedDoctor];
        const doctorInfoBox = document.getElementById('doctorInfo');
        
        if (doctorInfoBox) {
            doctorInfoBox.innerHTML = `
                <i class="fas fa-user-md"></i>
                <div>
                    <h3>${doctor.fullName}</h3>
                    <p><i class="fas fa-calendar-alt"></i> Рабочие дни: ${doctor.workingDaysText}</p>
                    <p><i class="fas fa-clock"></i> Часы приёма: ${doctor.workingHoursText}</p>
                </div>
            `;
        }
        
        const timeTitle = document.getElementById('timeTitle');
        if (timeTitle) {
            timeTitle.textContent = `Выберите время для приёма у ${doctor.name}:`;
        }
    }
    
    // Генерация календаря
    generateDatePicker() {
        if (!this.selectedDoctor) return;
        
        const doctor = this.doctors[this.selectedDoctor];
        const datePicker = document.getElementById('datePicker');
        if (!datePicker) return;
        
        datePicker.innerHTML = '';
        
        const today = new Date();
        const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const monthNames = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        
        // 21 день вперед (3 недели)
        for (let i = 0; i < 21; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isDoctorWorking = doctor.workingDays.includes(dayOfWeek);
            const isToday = i === 0;
            
            const hasAvailableSlots = this.checkDateAvailability(date, doctor);
            
            // Статус
            let statusClass = 'status-available';
            let statusText = 'Доступно';
            
            if (isWeekend) {
                statusClass = 'status-weekend';
                statusText = 'Выходной';
            } else if (!isDoctorWorking) {
                statusClass = 'status-doctor-off';
                statusText = 'Врач не работает';
            } else if (!hasAvailableSlots) {
                statusClass = 'status-doctor-off';
                statusText = 'Нет слотов';
            }
            
            const dateOption = document.createElement('div');
            dateOption.className = 'date-option';
            dateOption.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dateOption.dataset.dayOfWeek = dayOfWeek;
            
            if (isToday) {
                dateOption.classList.add('today');
            }
            
            // Блокируем недоступные
            const isDisabled = isWeekend || !isDoctorWorking || !hasAvailableSlots;
            
            if (isDisabled) {
                dateOption.classList.add('disabled');
                dateOption.style.opacity = '0.6';
                dateOption.style.cursor = 'not-allowed';
            } else {
                dateOption.addEventListener('click', (e) => this.selectDate(e.currentTarget));
            }
            
            dateOption.innerHTML = `
                <div class="date-day">${day}</div>
                <div class="date-month">${monthNames[month]}</div>
                <div class="date-weekday">${daysOfWeek[dayOfWeek]}</div>
                <div class="date-status ${statusClass}">${statusText}</div>
            `;
            
            datePicker.appendChild(dateOption);
        }
    }
    
    // Проверка доступности даты
    checkDateAvailability(date, doctor) {
        const dateStr = date.toISOString().split('T')[0];
        const appointments = JSON.parse(localStorage.getItem('lorAppointments')) || [];
        
        const busyTimes = appointments
            .filter(app => 
                app.doctor === this.selectedDoctor && 
                app.date === dateStr
            )
            .map(app => app.time);
        
        return busyTimes.length < doctor.workingHours.length;
    }
    
    // Выбор даты
    selectDate(dateElement) {
        document.querySelectorAll('.date-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        dateElement.classList.add('selected');
        
        this.selectedDate = dateElement.dataset.date;
        this.appointmentData.date = this.selectedDate;
        
        this.generateTimeSlots();
        
        const nextBtn = document.getElementById('nextStep2');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    // Генерация слотов времени
    generateTimeSlots() {
        if (!this.selectedDoctor || !this.selectedDate) return;
        
        const doctor = this.doctors[this.selectedDoctor];
        const timeGrid = document.getElementById('timeGrid');
        const timeNotification = document.getElementById('timeNotification');
        
        if (!timeGrid) return;
        
        timeGrid.innerHTML = '';
        
        const appointments = JSON.parse(localStorage.getItem('lorAppointments')) || [];
        const busySlots = appointments
            .filter(app => 
                app.doctor === this.selectedDoctor && 
                app.date === this.selectedDate
            )
            .map(app => app.time);
        
        const sortedTimes = [...doctor.workingHours].sort();
        
        let availableSlots = 0;
        
        sortedTimes.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.dataset.time = time;
            timeSlot.textContent = time;
            
            const isBusy = busySlots.includes(time);
            
            if (isBusy) {
                timeSlot.classList.add('busy');
                timeSlot.style.cursor = 'not-allowed';
                timeSlot.style.opacity = '0.6';
                timeSlot.style.backgroundColor = '#ffebee';
                timeSlot.style.color = '#c62828';
                timeSlot.style.borderColor = '#ef9a9a';
                timeSlot.title = 'Занято';
                
                const busyBadge = document.createElement('div');
                busyBadge.className = 'busy-badge';
                busyBadge.textContent = 'ЗАНЯТО';
                busyBadge.style.position = 'absolute';
                busyBadge.style.top = '2px';
                busyBadge.style.right = '2px';
                busyBadge.style.background = '#c62828';
                busyBadge.style.color = 'white';
                busyBadge.style.fontSize = '9px';
                busyBadge.style.padding = '2px 4px';
                busyBadge.style.borderRadius = '3px';
                busyBadge.style.fontWeight = 'bold';
                
                timeSlot.style.position = 'relative';
                timeSlot.appendChild(busyBadge);
            } else {
                availableSlots++;
                timeSlot.addEventListener('click', () => this.selectTime(timeSlot));
                timeSlot.title = 'Выбрать время';
            }
            
            timeGrid.appendChild(timeSlot);
        });
        
        // Уведомление если нет слотов
        if (timeNotification) {
            if (availableSlots === 0) {
                timeNotification.style.display = 'flex';
                const timeMessage = document.getElementById('timeMessage');
                if (timeMessage) {
                    timeMessage.innerHTML = `
                        <strong>На эту дату нет свободного времени.</strong>
                        <br>Выберите другую дату.
                    `;
                }
                const nextBtn = document.getElementById('nextStep2');
                if (nextBtn) nextBtn.disabled = true;
                
                this.selectedDate = null;
                this.selectedTime = null;
                document.querySelectorAll('.date-option.selected').forEach(option => {
                    option.classList.remove('selected');
                });
            } else {
                timeNotification.style.display = 'none';
                const nextBtn = document.getElementById('nextStep2');
                if (nextBtn) nextBtn.disabled = false;
            }
        }
    }
    
    // Выбор времени
    selectTime(timeElement) {
        if (timeElement.classList.contains('busy')) {
            alert('Время занято. Выберите другое.');
            return;
        }
        
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        timeElement.classList.add('selected');
        
        this.selectedTime = timeElement.dataset.time;
        this.appointmentData.time = this.selectedTime;
        
        const nextBtn = document.getElementById('nextStep2');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    // Обновление стоимости
    updatePriceSummary() {
        let total = 0;
        this.selectedServices = [];
        
        document.querySelectorAll('input[name="service"]:checked').forEach(checkbox => {
            const serviceName = checkbox.value;
            const price = this.servicePrices[serviceName] || 0;
            total += price;
            this.selectedServices.push(serviceName);
        });
        
        const discount = Math.round(total * 0.1);
        const finalPrice = total - discount;
        
        const servicesPrice = document.getElementById('servicesPrice');
        const discountPrice = document.getElementById('discountPrice');
        const totalPrice = document.getElementById('totalPrice');
        
        if (servicesPrice) servicesPrice.textContent = `${total.toLocaleString('ru-RU')} ₽`;
        if (discountPrice) discountPrice.textContent = `-${discount.toLocaleString('ru-RU')} ₽`;
        if (totalPrice) totalPrice.textContent = `${finalPrice.toLocaleString('ru-RU')} ₽`;
        
        this.appointmentData.services = this.selectedServices;
        this.appointmentData.totalPrice = total;
        this.appointmentData.discount = discount;
        this.appointmentData.finalPrice = finalPrice;
    }
    
    // Обновление сводки
    updateAppointmentSummary() {
        if (!this.selectedDoctor || !this.selectedDate || !this.selectedTime) return;
        
        const doctor = this.doctors[this.selectedDoctor];
        const date = new Date(this.selectedDate);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        });
        
        const summary = document.getElementById('appointmentSummary');
        if (!summary) return;
        
        let servicesHTML = '';
        if (this.selectedServices.length > 0) {
            servicesHTML = '<ul style="margin: 10px 0; padding-left: 20px;">';
            this.selectedServices.forEach(service => {
                servicesHTML += `<li>${service} - ${this.servicePrices[service].toLocaleString('ru-RU')} ₽</li>`;
            });
            servicesHTML += '</ul>';
        } else {
            servicesHTML = '<p style="color: #666; font-style: italic;">Услуги не выбраны</p>';
        }
        
        summary.innerHTML = `
            <h3 style="color: #1a5f9e; margin-bottom: 20px;">Сводка записи</h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 12px; font-size: 15px;">
                <div style="font-weight: 500; color: #666;">Врач:</div>
                <div style="color: #1a5f9e; font-weight: 600;">${doctor.fullName}</div>
                
                <div style="font-weight: 500; color: #666;">Дата приёма:</div>
                <div style="color: #1a5f9e; font-weight: 600;">${formattedDate}</div>
                
                <div style="font-weight: 500; color: #666;">Время:</div>
                <div style="color: #1a5f9e; font-weight: 600;">${this.selectedTime}</div>
                
                <div style="font-weight: 500; color: #666;">Услуги:</div>
                <div>${servicesHTML}</div>
                
                <div style="font-weight: 500; color: #666;">Итого:</div>
                <div style="color: #2a9d8f; font-size: 24px; font-weight: bold;">
                    ${this.appointmentData.finalPrice ? this.appointmentData.finalPrice.toLocaleString('ru-RU') : '0'} ₽
                </div>
            </div>
        `;
    }
    
    // Отправка записи (БЕЗ ТЕЛЕГИ!)
    async submitAppointment() {
        // Очистка ошибок
        document.querySelectorAll('.input-error').forEach(error => error.remove());
        document.querySelectorAll('.form-input').forEach(input => {
            input.style.borderColor = '';
        });
        
        // Данные формы
        const fullName = document.getElementById('fullName')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const birthDate = document.getElementById('birthDate')?.value;
        const symptoms = document.getElementById('symptoms')?.value.trim();
        
        // Валидация
        let hasErrors = false;
        
        // ФИО
        if (!fullName) {
            this.showInputError(document.getElementById('fullName'), 'Введите ФИО');
            hasErrors = true;
        } else if (fullName.split(' ').length < 2) {
            this.showInputError(document.getElementById('fullName'), 'Введите полное ФИО');
            hasErrors = true;
        }
        
        // Телефон
        if (!phone) {
            this.showInputError(document.getElementById('phone'), 'Введите телефон');
            hasErrors = true;
        } else {
            const phoneDigits = phone.replace(/\D/g, '');
            if (phoneDigits.length !== 11) {
                this.showInputError(document.getElementById('phone'), 'Некорректный номер');
                hasErrors = true;
            }
        }
        
        // Email
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showInputError(document.getElementById('email'), 'Некорректный email');
                hasErrors = true;
            }
        }
        
        // Проверка основных данных
        if (!this.selectedDoctor || !this.selectedDate || !this.selectedTime) {
            alert('Выберите врача, дату и время');
            this.showStep(1);
            return;
        }
        
        // Проверка на занятость времени
        const appointments = JSON.parse(localStorage.getItem('lorAppointments')) || [];
        const isSlotBusy = appointments.some(app => 
            app.doctor === this.selectedDoctor && 
            app.date === this.selectedDate && 
            app.time === this.selectedTime
        );
        
        if (isSlotBusy) {
            alert('Время занято. Выберите другое.');
            this.generateTimeSlots();
            this.showStep(2);
            return;
        }
        
        if (hasErrors) {
            alert('Исправьте ошибки в форме');
            return;
        }

        // Данные пользователя
        const currentUser = JSON.parse(localStorage.getItem('lorCurrentUser'));
        if (currentUser) {
            this.appointmentData.userId = currentUser.id;
            this.appointmentData.email = currentUser.email;
        }
        
        // Сохранение данных
        this.appointmentData.fullName = fullName;
        this.appointmentData.phone = phone;
        this.appointmentData.email = email || '';
        this.appointmentData.birthDate = birthDate || '';
        this.appointmentData.symptoms = symptoms || '';
        this.appointmentData.timestamp = new Date().toISOString();
        this.appointmentData.id = Date.now();
        this.appointmentData.status = 'ожидает';
        
        // Сохранение в localStorage
        appointments.push(this.appointmentData);
        localStorage.setItem('lorAppointments', JSON.stringify(appointments));
        
        // Показываем результат
        this.showResult();
    }
    
    // Показ результата
    showResult() {
        if (!this.selectedDoctor) return;
        
        const doctor = this.doctors[this.selectedDoctor];
        const date = new Date(this.selectedDate);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const appointmentNumber = document.getElementById('appointmentNumber');
        if (appointmentNumber) {
            appointmentNumber.textContent = `#${this.appointmentData.id.toString().slice(-6)}`;
        }
        
        const resultDetails = document.getElementById('resultDetails');
        if (resultDetails) {
            resultDetails.innerHTML = `
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 15px;">
                    <div style="font-weight: 500;">Пациент:</div>
                    <div>${this.appointmentData.fullName}</div>
                    
                    <div style="font-weight: 500;">Телефон:</div>
                    <div>${this.appointmentData.phone}</div>
                    
                    <div style="font-weight: 500;">Врач:</div>
                    <div>${doctor.fullName}</div>
                    
                    <div style="font-weight: 500;">Дата и время:</div>
                    <div>${formattedDate} в ${this.selectedTime}</div>
                    
                    <div style="font-weight: 500;">Услуги:</div>
                    <div>${this.selectedServices.join(', ') || 'Не выбраны'}</div>
                    
                    <div style="font-weight: 500;">Стоимость:</div>
                    <div>${this.appointmentData.finalPrice?.toLocaleString('ru-RU') || '0'} ₽</div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 10px; border-left: 4px solid #28a745;">
                    <i class="fas fa-clock"></i> 
                    <strong>Что дальше?</strong>
                    <p style="margin: 10px 0 0 0; font-size: 14px;">
                        1. Мы свяжемся с вами в течение 30 минут<br>
                        2. Приходите за 10 минут до времени<br>
                        3. Возьмите паспорт и страховой полис
                    </p>
                </div>
            `;
        }
        
        this.showStep('result');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.appointment-page')) {
        window.appointmentSystem = new AppointmentSystem();
    }
});