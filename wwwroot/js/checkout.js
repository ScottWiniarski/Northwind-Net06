$(function () {
    //Apply Discount
    $('#discountCodeButton').on('click', function(){
        let inputtedCode = $('#discountCodeInput').val();
        let discountPercent = 0;

        //Checks if a corresponding div exists with this code. The jQuery .length function will return 0 for something that doesn't exist.
        if ($(`#discount-${inputtedCode}`).length){
            discountPercent = $(`#discount-${inputtedCode}`).data('discount-percent');
            discountProductId = $(`#discount-${inputtedCode}`).data('product-id');

            console.log(discountPercent, discountProductId)

            //Loop through cart items to see if the discount applies to one of them
            let numProducts = $('#numProductsInCart').data('cart-quantity');
            
            let cartItemMatch = 0;

            for (let i = 1; i <= numProducts; i++){
                if($(`#product_${i}`).data('product-id') == discountProductId){
                    cartItemMatch = i;
                }
            }

            console.log(cartItemMatch);

            //Finally, if the code exists and applies to a product in the cart, manipulate the data.
            if (cartItemMatch){

                $('#discountPercentContainer').html(discountPercent);

                let newUnitPrice = $(`#price_${cartItemMatch}`).data('unit-price') * (1 - discountPercent);
                let quantity = $(`#qty_${cartItemMatch}`).data('quantity');
                let total = newUnitPrice * quantity;

                //Modify row
                $(`#price_${cartItemMatch}`).html(newUnitPrice.toFixed(2));

                $(`#discountPercentContainer_${cartItemMatch}`).html(discountPercent);

                $(`#total_${cartItemMatch}`).html(total.toFixed(2));


                
                //Modify order total
                let orderTotal = 0;

                for (let i = 1; i <= numProducts; i++){
                    orderTotal += Number($(`#total_${i}`).html())
                }

                $('#orderTotal').html(orderTotal.toFixed(2));

            } else {
                toast('Cannot Apply Discount', 'The discount code you entered was for a product not in your cart.')
            }

        } else {
            toast('Invalid Code', 'The discount code you entered does not correspond with any current discounts.');
        }
    })

    //Submit order
    $('#place-order-btn').on('click', function(){
        console.log('Placing order');

        $('.orderConfirmationButton').attr("disabled", true);
        
        //Figuring out OrderDetails
        let numProducts = $('#numProductsInCart').data('cart-quantity');

        let orderDetailModels = [];
        for (let i = 1; i <= numProducts; i++){
            orderDetailModels.push(new OrderDetailsJSON(
                $(`#product_${i}`).data('product-id'),
                $(`#price_${i}`).data('unit-price'),
                $(`#qty_${i}`).data('quantity'),
                $(`#discountPercentContainer_${i}`).html()
            ))
        }

        console.log(orderDetailModels);


        //AJAX Call
        $.ajax({
            headers: { "Content-Type": "application/json" },
            url: "../../api/submitOrder",
            type: 'post',
            data: JSON.stringify({
                "customerEmail": $('#User').data('email'),
                "orderDetails": orderDetailModels
            }),
            success: function (response, textStatus, jqXhr) {
                // success
                toast("Order Successfully Placed", `Your order has been created.`);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                console.log("The following error occured: " + jqXHR.status, errorThrown);
                toast("Error", "Please try again later.");
            }
        });
    })
})

class OrderDetailsJSON {
    constructor(productId, unitPrice, quantity, discount){
        this.productId = productId;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.discount = discount;
    }
}

function toast(header, message) {
    $('#toast_header').html(header);
    $('#toast_body').html(message);
    $('#cart_toast').toast({ delay: 2500 }).toast('show');
}