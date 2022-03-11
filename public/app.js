const toCurrency = price => new Intl.NumberFormat('ru-RU', {
  currency: 'rub',
  style: 'currency',
}).format(price);

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

const cardContainer = document.querySelector('#card');
if (cardContainer) {
  cardContainer.addEventListener('click', evt => {
    if (evt.target.classList.contains('js-remove-course')) {
      const id = evt.target.dataset.id;

      fetch(`card/remove/${id}`, {
        method: 'delete',
      })
          .then(res => res.json())
          .then(card => {
            if (card.courses.length) {
              const html = card.courses.map(c => {
                return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>${c.amount}</td>
                  <td>
                    <button class="btn btn-small js-remove-course" data-id=${c.id}>Delete</button>
                  </td>
                </tr>`;
              }).join('');
              cardContainer.querySelector('tbody').innerHTML = html;
              cardContainer.querySelector('.price').textContent = toCurrency(card.price);
            } else {
              cardContainer.innerHTML = '<p>Card is empty</p>';
            }
          });
    }
  });
}
