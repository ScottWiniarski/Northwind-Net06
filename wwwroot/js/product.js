$(function () {
    getProducts()
    function getProducts() {
      var discontinued = $('#Discontinued').prop('checked') ? "" : "/discontinued/false";
      $.getJSON({
        url: `../../api/category/${$('#product_rows').data('id')}/product` + discontinued,
        success: function (response, textStatus, jqXhr) {
          $('#product_rows').html("");
            for (var i = 0; i < response.length; i++){
              var css = response[i].discontinued ? " class='discontinued'" : "";
              var row = `<tr${css} data-id="${response[i].productId}" data-name="${response[i].productName}" data-price="${response[i].unitPrice}">
                <td>${response[i].productName}</td>
                <td class="text-right">${response[i].unitPrice.toFixed(2)}</td>
                <td class="text-right">${response[i].unitsInStock}</td>
              </tr>`;
              $('#product_rows').append(row);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // log the error to the console
          console.log("The following error occured: " + textStatus, errorThrown);
        }
      });
    }
    $('#CategoryId').on('change', function(){
      $('#product_rows').data('id', $(this).val());
      getProducts();
    });
    $('#Discontinued').on('change', function(){
      getProducts();
    });
    // delegated event listener
    $('#product_rows').on('click', 'tr', function(){
      // make sure a customer is logged in
      if ($('#User').data('customer').toLowerCase() == "true"){
        $('#ProductId').html($(this).data('id'));
        $('#ProductName').html($(this).data('name'));
        $('#UnitPrice').html($(this).data('price').toFixed(2));
        // calculate and display total in modal
        $('#Quantity').change();
        $('#cartModal').modal();
      } else {
        toast("Access Denied", "You must be signed in as a customer to access the cart.");
      }
    });
    // update total when cart quantity is changed
    $('#Quantity').change(function () {
      var total = parseInt($(this).val()) * parseFloat($('#UnitPrice').html());
      $('#Total').html(numberWithCommas(total.toFixed(2)));
    });
    // function to display commas in number
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    

    $(".increasecartquantity").on('click', function(){
      var id = $(this).data('id');
      var qty = Number($('#qty_' + id).html()) + 1;
      var itemPrice = Number($('#price_' + id).html());
      console.log(itemPrice);
      var currentTotal = qty * itemPrice;
      $('#qty_' + id).html(qty);
      $('#total_' + id).html(currentTotal);

      console.log('id: ' + id);
      console.log('qty: ' + $('#qty_' + id).html());
      console.log('price: ' + $('#price_' + id).html());
      console.log('Total: ' + $("#total_" + id).html());

      // console.log($("#cartquantity").val());
      // $("#Quantity").change(function (){
      //   var subtotal = $((this).val()++);
      //   $("#editedquantity").html(subtotal.toString());
      // })
      
    });

    // $('#updateCartQuantity').on('click', function(){
    //   $.ajax({
    //     headers: {"Content-Type": "application/json"},
    //     url: "../../cart/updatequantity",
    //     type: 'post',
    //     data: JSON.stringify({
    //       "id": Number($('#ProductId').html()),
    //       "email": $('#User').data('email'),
    //       "qty": Number($('#Quantity').val())
    //     }),
    //     success: function (response, textStatus, jqXhr) {
    //       // success
    //       toast("Product Quantity Increased", `${response.product.productName} .`);
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //       // log the error to the console
    //       console.log("The following error occured: " + jqXHR.status, errorThrown);
    //       toast("Error", "Please try again later.");
    //     }
    //   })
    // },

    $('#addToCart').on('click', function(){
      console.log("added item");
      $('#cartModal').modal('hide');
      $.ajax({
        headers: { "Content-Type": "application/json" },
        url: "../../api/addtocart",
        type: 'post',
        data: JSON.stringify({
          "id": Number($('#ProductId').html()),
          "email": $('#User').data('email'),
          "qty": Number($('#Quantity').val()) 
        }),
        success: function (response, textStatus, jqXhr) {
          // success
          toast("Product Added", `${response.product.productName} successfully added to cart.`);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // log the error to the console
          console.log("The following error occured: " + jqXHR.status, errorThrown);
          toast("Error", "Please try again later.");
        }
      });
  });
  function toast(header, message) {
    $('#toast_header').html(header);
    $('#toast_body').html(message);
    $('#cart_toast').toast({ delay: 2500 }).toast('show');
  }
});
  