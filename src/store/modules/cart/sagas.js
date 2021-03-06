import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/formatPrice';
import { addToCartSuccess, updateAmountSuccess } from './actions';

function* addToCart({ login }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.login === login)
  );

  const currentAmount = productExists ? productExists.amount : 0;
  const amount = currentAmount + 1;

  if (productExists) {
    yield put(updateAmountSuccess(login, amount));
  } else {
    const response = yield call(api.get, `/users/${login}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.followers),
    };
    yield put(addToCartSuccess(data));
    toast.success('Produto adicionado no carrinho!');

    history.push('/cart');
  }
}

function* updateAmount({ login, amount }) {
  if (amount <= 0) return;

  yield put(updateAmountSuccess(login, amount));
}

// qual action ouvir e qual método disparar
export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
