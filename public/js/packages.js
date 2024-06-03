document.addEventListener("DOMContentLoaded", function() {
    const profileDropdown = document.querySelector(".profile-dropdown");
    const dropdownContent = document.querySelector(".profile-dropdown-content");

    // Function to show dropdown content
    function showDropdown() {
        dropdownContent.style.display = "block";
    }

    // Function to hide dropdown content
    function hideDropdown() {
        dropdownContent.style.display = "none";
    }

    // Event listener to show dropdown content when hovering over the profile dropdown
    profileDropdown.addEventListener("mouseenter", showDropdown);

    // Event listener to hide dropdown content when cursor moves out of the dropdown content
    dropdownContent.addEventListener("mouseleave", hideDropdown);
});

        const packages = [
        { name: "Jaipur", price: 800, rating: 4, duration: "4 days", location: "India", img: "/img/home-place.jpg" },
        { name: "Lakshadweep", price: 2000, rating: 5, duration: "6 days", location: "India", img: "/img/home-lake.jpg" },
        { name: "Shimla", price: 700, rating: 3, duration: "3 days", location: "India", img: "/img/home-mountain.jpg" },
        { name: "Goa", price: 1500, rating: 4, duration: "5 days", location: "India", img: "/img/home-beach.jpg" },
        { name: "Amritsar", price: 900, rating: 4, duration: "4 days", location: "India", img: "/img/popular-temple.jpg" },
        { name: "Kerala", price: 1800, rating: 5, duration: "7 days", location: "India", img: "/img/popular-forest.jpg" },
        { name: "Delhi", price: 600, rating: 3, duration: "3 days", location: "India", img: "/img/popular-monument.jpg" },
    ];

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('price').value = 0;
        document.getElementById('price-value').textContent = `Up to ₹0`;
    });

    document.getElementById('price').addEventListener('input', function() {
        document.getElementById('price-value').textContent = `Up to ₹${this.value}`;
    });

    function filterPackages() {
        const packageName = document.getElementById('package-name').value.toLowerCase();
        const priceRange = document.getElementById('price').value;
        const sortOption = document.getElementById('sort').value;

        let filteredPackages = packages.filter(pkg => {
            const nameMatch = pkg.name.toLowerCase().includes(packageName);
            const priceMatch = pkg.price <= priceRange;
            return nameMatch && priceMatch;
        });

        if (sortOption === 'low-to-high') {
            filteredPackages.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'high-to-low') {
            filteredPackages.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'top-rated') {
            filteredPackages.sort((a, b) => b.rating - a.rating);
        }

        displayPackages(filteredPackages);
    }

    function displayPackages(packageList) {
        const packagesList = document.getElementById('packages-list');
        packagesList.innerHTML = '';

        packageList.forEach(pkg => {
            const packageElement = document.createElement('div');
            packageElement.classList.add('package');
            packageElement.dataset.name = pkg.name;
            packageElement.dataset.price = pkg.price;
            packageElement.dataset.rating = pkg.rating;
            packageElement.innerHTML = `
                <img src="${pkg.img}" alt="${pkg.name}">
                <div class="package-details">
                    <h3>${pkg.name}</h3>
                    <p>${pkg.location}</p>
                    <p>Duration: ${pkg.duration}</p>
                    <div class="star-rating">${'★'.repeat(pkg.rating)}${'☆'.repeat(5 - pkg.rating)}</div>
                </div>
                <div class="package-price">₹${pkg.price}</div>
                <a class="book-now" href="/booking/${pkg.name}/${pkg.location}/${pkg.duration}/${pkg.rating}/${pkg.price}" style="background-color: blue; padding: 10px 20px; color: white; text-decoration: none; border-radius: 20px; margin-left: 10px;">Book Now</a>
            `;
            packagesList.appendChild(packageElement);
        });
    }

    document.getElementById('apply-filters').addEventListener('click', filterPackages);

    function autocomplete(input, arr) {
        let currentFocus;
        input.addEventListener('input', function() {
            let list, item, val = this.value;

            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;

            list = document.createElement('div');
            list.setAttribute('id', this.id + 'autocomplete-list');
            list.setAttribute('class', 'autocomplete-items');
            this.parentNode.appendChild(list);

            arr.forEach(pkg => {
                if (pkg.name.substr(0, val.length).toLowerCase() == val.toLowerCase()) {
                    item = document.createElement('div');
                    item.innerHTML = "<strong>" + pkg.name.substr(0, val.length) + "</strong>";
                    item.innerHTML += pkg.name.substr(val.length);
                    item.innerHTML += "<input type='hidden' value='" + pkg.name + "'>";
                    item.addEventListener('click', function() {
                        input.value = this.getElementsByTagName('input')[0].value;
                        closeAllLists();
                    });
                    list.appendChild(item);
                }
            });
        });

        input.addEventListener('keydown', function(e) {
            let x = document.getElementById(this.id + 'autocomplete-list');
            if (x) x = x.getElementsByTagName('div');
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = x.length - 1;
            x[currentFocus].classList.add('autocomplete-active');
        }

        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove('autocomplete-active');
            }
        }

        function closeAllLists(elmnt) {
            const items = document.getElementsByClassName('autocomplete-items');
            for (let i = 0; i < items.length; i++) {
                if (elmnt != items[i] && elmnt != input) {
                    items[i].parentNode.removeChild(items[i]);
                }
            }
        }

        document.addEventListener('click', function (e) {
            closeAllLists(e.target);
        });
    }
    autocomplete(document.getElementById('package-name'), packages);


        // function displayPackages(packageList) {
        //     const packagesList = document.getElementById('packages-list');
        //     packagesList.innerHTML = '';

        //     packageList.forEach(pkg => {
        //         const packageElement = document.createElement('div');
        //         packageElement.classList.add('package');
        //         packageElement.innerHTML = `
        //             <img src="${pkg.img}" alt="${pkg.name}">
        //             <div class="package-details">
        //                 <h3>${pkg.name}</h3>
        //                 <p>${pkg.location}</p>
        //                 <p>Duration: ${pkg.duration}</p>
        //                 <div class="star-rating">${'★'.repeat(pkg.rating)}${'☆'.repeat(5 - pkg.rating)}</div>
        //             </div>
        //             <div class="package-price">₹${pkg.price}</div>
        //             <button class="book-now" onclick="bookNow(${JSON.stringify(pkg).replace(/"/g, '&quot;')})">Book Now</button>
        //         `;
        //         packagesList.appendChild(packageElement);
        //     });
        // }

        // function bookNow(packageDetails) {
        //     localStorage.setItem('selectedPackage', JSON.stringify(packageDetails));
        //     window.location.href = 'booking.html';
        // }

        displayPackages(packages);
    