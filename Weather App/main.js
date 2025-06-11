const isiKota = document.querySelector('.input-kota');
const cariBtn = document.querySelector('.cari-btn');

const infoCuaca = document.querySelector('.info-cuaca');
const tidakAdaKota = document.querySelector('.tidakada-kota'); 
const pesanCari = document.querySelector('.cari-kota');

const kotaText = document.querySelector('.kota-text');
const tanggalText = document.querySelector('.tanggalsekarang-text');
const temperaturText = document.querySelector('.temparatur-text');
const kondisiText = document.querySelector('.kondisi-text');
const gambarCuaca = document.querySelector('.gambar-cuaca');
const kelembabanText = document.querySelectorAll('.hunadity-value-text')[0];
const anginText = document.querySelectorAll('.hunadity-value-text')[1];

const forecastContainer = document.querySelector('.perkiraan-cuaca-kontainer');

const apiKey = '476ef1f2746f5dbea840500d44e27ee8'; // API key cuaca, jangan diambil bang

cariBtn.addEventListener('click', () => {
    if (isiKota.value.trim() !== '') {
        updateInfoCuaca();
        isiKota.value = '';
        isiKota.blur();
    }
});

isiKota.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && isiKota.value.trim() !== '') {
        updateInfoCuaca();
        isiKota.value = '';
        isiKota.blur();
    }
});

function updateInfoCuaca() {
    const kota = isiKota.value.trim();
    const cuacaUrl = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${kota}&appid=${apiKey}&units=metric`;

    function getLocalWeatherIcon(iconCode) {
        const map = {
            '01d': 'clear.svg',
            '01n': 'clear.svg',
            '02d': 'clouds.svg',
            '02n': 'clouds.svg',
            '03d': 'clouds.svg',
            '03n': 'clouds.svg',
            '04d': 'clouds.svg',
            '04n': 'clouds.svg',
            '09d': 'rain.svg',
            '09n': 'rain.svg',
            '10d': 'rain.svg',
            '10n': 'rain.svg',
            '11d': 'thunderstorm.svg',
            '11n': 'thunderstorm.svg',
            '13d': 'snow.svg',
            '13n': 'snow.svg',
            '50d': 'mist.svg',
            '50n': 'mist.svg',
        };
    
        return `assets/weather/${map[iconCode] || 'clouds.svg'}`;
    }
    
    fetch(cuacaUrl)
        .then(res => {
            if (!res.ok) throw new Error('Kota tidak ditemukan');
            return res.json();
        })
        .then(data => {
            pesanCari.style.display = 'none';
            tidakAdaKota.style.display = 'none';
            infoCuaca.style.display = 'flex';

            kotaText.textContent = data.name;
            temperaturText.textContent = `${Math.round(data.main.temp)} °C`;
            kondisiText.textContent = data.weather[0].main;
            kelembabanText.textContent = `${data.main.humidity}%`;
            anginText.textContent = `${data.wind.speed} M/s`;
            gambarCuaca.src = getLocalWeatherIcon(data.weather[0].icon);


            const tanggal = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            tanggalText.textContent = tanggal.toLocaleDateString('id-ID', options);
        })
        .catch(err => {
            infoCuaca.style.display = 'none';
            tidakAdaKota.style.display = 'flex';
            pesanCari.style.display = 'none';
        });

    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            forecastContainer.innerHTML = '';
            const hariUnik = [];

            data.list.forEach(item => {
                const tanggal = new Date(item.dt_txt);
                const hari = tanggal.getDate();

                if (!hariUnik.includes(hari) && hariUnik.length < 4) {
                    hariUnik.push(hari);

                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('perkiraan-item');

                    forecastItem.innerHTML = `
                        <h5 class="item-perkiraan-tanggal normal-text">${tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</h5>
                        <img src="${getLocalWeatherIcon(item.weather[0].icon)}" class="gambar-perkiraan-cuaca">
                        <h5 class="perkiraan-temperatur">${Math.round(item.main.temp)} °C</h5>
                    `;

                    forecastContainer.appendChild(forecastItem);
                }
            });
        });
}
