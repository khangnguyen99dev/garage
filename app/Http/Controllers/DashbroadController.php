<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customers;
use App\Models\ReceiveVotes;
use App\Models\RepairVotes;
use Carbon\Carbon;
use App\Models\CarBrands;
use App\Models\Categories;
use App\Models\Setting;
use DB;

class DashbroadController extends Controller
{
    protected $receive_vote;
    protected $customer;
    protected $imageService;
    protected $repair_vote;
    protected $car_brand;
    protected $category;

    function __construct (
        Categories $category,
        CarBrands $car_brand
        ) 
    {
        $this->car_brand = $car_brand;
        $this->category = $category;
    }

    public function getStatistics ($option) {
        switch ($option) {
            case 'carbrand':
                return $this->car_brand-> getCarBrands ();
            case 'category':
                return $this->category-> getCategories ();
            default:
                return [];
                break;
        }
    }

    public function getDashbroad (Request $request) {

        $query    =     RepairVotes::join('receive_votes','receive_votes.id','repair_votes.receive_vote_id')
                        ->join('users','users.id','repair_votes.user_id')
                        ->join('cars','cars.number_car','receive_votes.number_car_id')
                        ->leftJoin('car_brands','car_brands.id','cars.car_brand_id')
                        ->leftJoin('customers','customers.id','cars.customer_id');

        $carbrands = $request->car_brands;
        if (sizeof($carbrands) > 0) {
            $query->where(function ($query) use ($carbrands) {
                foreach ($carbrands as $value) {
                    $query->orWhere('cars.car_brand_id', $value['value']);
                }
            });
        } 

        $categories = $request->categories;
        if (sizeof($categories) > 0) {
            $id_categories = array_column($categories, 'value');
            $query->whereHas('Products', function($query) use ($id_categories)
                {
                    $query
                        ->leftJoin('product_types','product_types.id', 'products.product_type_id')
                        ->leftJoin('categories','categories.id','product_types.category_id')
                        ->whereIn('categories.id', $id_categories);
                })->with(['Products' => function ($query) {
                    $query
                        ->leftJoin('product_types','product_types.id', 'products.product_type_id')
                        ->leftJoin('categories','categories.id','product_types.category_id')
                        ->leftJoin('suppliers','suppliers.id', 'products.supplier_id')
                        ->select('products.*', 'product_types.name as name_product_type','categories.name as name_category', 'suppliers.name as name_supplier');
                }]);
                
        } else {
            $query->with(['Products' => function ($query) {
                $query
                    ->leftJoin('product_types','product_types.id', 'products.product_type_id')
                    ->leftJoin('categories','categories.id','product_types.category_id')
                    ->leftJoin('suppliers','suppliers.id', 'products.supplier_id')
                    ->select('products.*', 'product_types.name as name_product_type','categories.name as name_category', 'suppliers.name as name_supplier');
            }]);
        }

        $service_types = $request->service_types;
        if (sizeof($service_types) > 0) {
            $id_service_types = array_column($service_types, 'value');
            $query->whereHas('Services', function($query) use ($id_service_types)
                {
                    $query
                        ->leftJoin('service_types','service_types.id','services.service_type_id')
                        ->whereIn('service_types.id', $id_service_types);

                })->with(['Services'=> function ($query) {
                    $query
                        ->leftJoin('service_types','service_types.id','services.service_type_id')
                        ->select('services.*','service_types.name as name_service_type');
                }]);          
        } else {
            $query->with(['Services'=> function ($query) {
                $query
                    ->leftJoin('service_types','service_types.id','services.service_type_id')
                    ->select('services.*','service_types.name as name_service_type');
            }]);  
        }

        $customers = $request->customers;
        if (sizeof($customers) > 0) {
            $query->where(function ($query) use ($customers) {
                foreach ($customers as $value) {
                    $query->orWhere('cars.customer_id', $value['value']);
                }
            });
        } 

        $employee_technical = $request->employee_technical;
        if (sizeof($employee_technical) > 0) {
            $query->where(function ($query) use ($employee_technical) {
                foreach ($employee_technical as $value) {
                    $query->orWhere('repair_votes.user_id', $value['value']);
                }
            });
        } 

        $status = $request->status;
        if (sizeof($status) > 0) {
            $query->where(function ($query) use ($status) {
                foreach ($status as $value) {
                    $query->orWhere('receive_votes.status', $value['value']);
                }
            });
        } 


        $suppliers = $request->suppliers;
        if (sizeof($suppliers) > 0) {
            $id_suppliers = array_column($suppliers, 'value');
            $query->whereHas('Products', function($query) use ($id_suppliers)
                {
                    $query
                        ->leftJoin('suppliers','suppliers.id', 'products.supplier_id')
                        ->whereIn('suppliers.id', $id_suppliers);
                });
        } 


        $address = $request->address;
        if(strlen($address) > 0) {
            $query->where(function ($query) use ($address) {
                $query->orwhere('customers.address','LIKE', '%'.$address.'%');
            });
        }

        $date_range = $request->date_range;
        if (sizeof($date_range)) {
            $query->whereBetween('repair_votes.repair_date', 
                    [
                        Carbon::parse($date_range[0]), 
                        Carbon::parse($date_range[1])->modify('23:59:59')
                    ]);
        } else {
            $now = Carbon::now();
            $query->whereBetween('repair_votes.repair_date', 
            [
                $now->copy()->startOfYear(), 
                $now->copy()->endOfYear()
            ]);
        }


        $data['arr_money']              =   $query->orderBy('repair_votes.repair_date', 'ASC')->pluck('repair_votes.total_price')->toArray();

        $data['arr_date']               =   $query->orderBy('repair_votes.repair_date', 'ASC')->pluck('repair_votes.repair_date')
                                            ->map(function($date) {
                                                return Carbon::parse($date)->format('d/m/Y');
                                            })->toArray();


        $data['data']                   =   $query->select('repair_votes.*',
                                                'car_brands.name as name_car_brand','customers.name as name_customer',
                                                'users.name as name_employee','receive_votes.status as status_receive_vote',
                                                'customers.address as address_customer')->orderBy('repair_votes.repair_date', 'ASC')->get();

        $data['count_total_revenue']    =   $data['data']->sum('total_price');

        $data['count_finished']         =   $data['data']->where('status_receive_vote', "3")->count();
          
        $data['count_order_pending']    =   ReceiveVotes::where('status', "0")->count();

        $data['count_received']         =   ReceiveVotes::where('status', "1")->count();

        return $data;

    }

    public function getSetting () {
        return Setting::first();
    }
}
