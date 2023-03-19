import Api from './Api'
import Csrf from './Csrf'

class Inventory {

    async inventoryStates() {
        await Csrf.getCookie()
        return Api.get('api/inventorystates')
    }

    async inventoryMovements() {
        await Csrf.getCookie()
        return Api.get('api/inventorymovements')
    }

    async getMovement(id) {
        await Csrf.getCookie()
        return Api.get('api/inventorymovements/'+ id)
    }

    async inventoryMovementCreate({
        product_id, delivery_id, quantity
    }) {
        await Csrf.getCookie()
        return Api.post('api/inventorymovements/new', { product_id, delivery_id, quantity })
    }

    async inventoryMovementUpdate(id, {
        product_id, delivery_id, quantity
    }) {
        await Csrf.getCookie()
        return Api.post('api/inventorymovements/update/' + id, { product_id, delivery_id, quantity })
    }

    async delete(id) {
        await Csrf.getCookie();
        return Api.delete('api/inventorymovements/delete/' + id)
    }
}



export default new Inventory();