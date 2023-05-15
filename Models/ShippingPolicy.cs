public static class ShippingPolicy {
    public static DateTime RequiredDate(DateTime orderDate){
        return orderDate.AddDays(14);
    }

    public static DateTime ShippedDate(DateTime orderDate){
        return orderDate.AddDays(2);
    }

    public static int ShippingVia(){
        return 1;
    }

    public static decimal FreightCost(decimal orderTotal){
        return 50 + (orderTotal * (decimal)0.15);
    }
}