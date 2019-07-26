const PRODUCT_URL = `https://acme-users-api-rev.herokuapp.com/api/products`;
const COMPANIES_URL = `https://acme-users-api-rev.herokuapp.com/api/companies`;
const offerings_URL = `https://acme-users-api-rev.herokuapp.com/api/offerings`;
const container = document.querySelector('#container');

let hidden = false;

Promise.all([fetch(PRODUCT_URL), fetch(COMPANIES_URL), fetch(offerings_URL)])
    .then(responses => Promise.all(responses.map( response => response.json())))
    // .then( console.log);
    .then (data => {
        const products = data[0];
        const companies = data[1];
        const offerings = data[2];

        let html = '';
        products.forEach( product => {
            html += `<div class="product" data-hash="${product.id}"><h3>${product.name}</h3><p>${product.description}</p>
            <p>$${product.suggestedPrice}</p><ul>`

            let productId = product.id;

            let offeringArr = offerings.filter((offering) => (offering.productId === productId));

            offeringArr.forEach(offering => {
                companies.forEach(company => {
                    if (company.id === offering.companyId) {
                        html += `<li>${company.name} at $${offering.price}</li>`
                    }
                })
            })

            html += "</ul></div>"

            // let companyArr = offeringArr.filter((offering) => {
            //     for(let company of companies){
            //         return company.id === offering.companyId;

            //     };
            // });

            // let companyArr = offeringArr.map( offer => {
            //     let companyId = offer.companyId

            //     return companies.filter( company => {
            //         return company.id === companyId
            //     })
            // }).filter(x => x !== undefined)


            // companyArr.forEach(company => {
            //     html += `<li>${company[0].name} at ${}</li>`
            // })

        });

        container.innerHTML = html;

        const productDivs = document.querySelectorAll(".product");
        productDivs.forEach(productDiv => {
            productDiv.addEventListener("click", (ev) => {
              window.location.hash = (hidden) ? "" : productDiv.dataset.hash;
            })
        });

        window.addEventListener("hashchange", ev => {
          hidden = !hidden;
          const trimmedHash = window.location.hash.slice(1);

          productDivs.forEach(productDiv => {
            if (!trimmedHash.length) {
              productDiv.classList.remove("hidden");
            } else if (productDiv.dataset.hash !== trimmedHash) {
              productDiv.classList.add("hidden");
            }
          })
        })
    })

