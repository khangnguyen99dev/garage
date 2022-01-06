<?php 
    namespace App\Repositories;
    use App\Models\BaseModel;
    use App\Models\Users;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Validator;
    use Illuminate\Foundation\Auth\ResetsPasswords;
    use DB;
    use App\Models\Cv;
    use App\Models\Cf;
    use Illuminate\Support\Str;
    use Auth;
    use Illuminate\Support\Facades\Hash;

    class BaseRepository implements BaseRepositoryInterface{ 
        use ResetsPasswords;
        use BaseActionFile;

        public function createCore($class,$input){         
            return $item =  call_user_func('App\Models\\'.$class . '::create',$input);
        }
     
        public function updateCore($item ,$input){
            return $item->update($input);
        }

        public function getOne($class,$dataoptions,$id,$options = ['fielddisplay'=>"*"]){
            return  $item = call_user_func('App\Models\\'.$class . '::where',$dataoptions[$class],$id)->select($options["fielddisplay"])->first();
        }

        public function getMany($class,$dataoptions,$id,$options =['fielddisplay'=>"*"]){
            return  $item = call_user_func('App\Models\\'.$class . '::where',$dataoptions[$class],$id)->select($options["fielddisplay"])->get();
        }

        public function getManytoMany ($class,$dataoptions,$id){
            $option = $this->getDiplayName($dataoptions[$class]);
            return $item = call_user_func('App\Models\\'.$class . '::'.$dataoptions['join'],$this->getTable($option[0]),$this->getTable($option[0]).'.'.$option[1],$this->getTable($class).'.'.$option[2])->where($option[3],$id)->get();
        }

        
     
        public function deleteCore($class,$id){
            return  $delete =  call_user_func('App\Models\\'.$class . '::destroy',$id);
        }
     
        public function basesearch($class,Request $request){
            $search = $request->get('search');
            $fieldsearch = $request->get('fieldsearch');
            $val = '%'.$search.'%';
            $query =call_user_func('App\Models\\'.$class . '::where',function($query) use ($val, $fieldsearch) {
            //  $query
                //    ->where('name','LIKE', '%'.$val.'%');
                    $query = $this->getQueryLike($query,$fieldsearch,$val);
                });
            $data =$query->get();
            return $data;
        }
     
        public function basestore($class,Request $request){
            \DB::beginTransaction();
            $data = $request->except(['model']);
            try {        
                $item =  $this->createCore($class,$data);
                if($item){  
                if (isset($data['options'])) {                     
                    foreach ($data['options'] as $key => $option) {
                        $this->crudRelation ($key , $option , $data, $item->id);
                    }   
                    $this->saveFile($item,$request); 
                    if( isset($data['options']['savefilecontents'])){
                        $this->saveContentFile($class,$data,$item);
                    }                  
                }  

                \DB::commit();
                    return ['status'=>true,'msg'=>'Created Successful!'];
                }else{
                    \DB::rollback();
                    return ['status'=>false,'msg'=>'Created fail!'];
                }
            } catch (\Exception $e) {
                \DB::rollback();
                return Cv::ParseException($e);
            }
        }

  
     
        public function baseupdate($class ,$id, Request $request){
            $data = $request->all();
            \DB::beginTransaction();
            //return $data;
            try {
                $item =  call_user_func('App\Models\\'.$class . '::find',$id);  
               
                if($item){
                    $item->fill($data);
                    $update = $this->updateCore($item,$data);
                    if (isset($data['options']) && $update) {
                        foreach ($data['options'] as $key => $option) {
                            $this->crudRelation ($key , $option , $data, $id);
                        }   
                        $this->saveFile($item,$request);   
                        if( isset($data['options']['savefilecontents'])){
                            $this->saveContentFile($class,$data,$item);
                        }                        
                    }
                    \DB::commit();      
                    return ['status'=>true,'msg'=>'Update Successful!'];            
                }else{
                        \DB::rollback();
                    return ['status'=>false,'msg'=>'Update fail!'];
                }      
            } catch (\Exception $e) {
                DB::rollback();
                return Cv::ParseException($e);
            }
        }

        public function crudRelation($key ,$option, $data,$id){
            switch ($key) {
                case 'onetoone':
                        foreach ($option as  $value) {
                            $this->onetoone ($data[array_keys($value)[0]], $value, $id);
                        }
                    break;
                case 'onetomany':
                        foreach ($option as $value) {
                            $this->onetomany ($data[array_keys($value)[0]], $value, $id);
                        }
                    break;
            }
        }
       

        public function onetoone ($data = [],$dataoptions,$id){
            $item = call_user_func('App\Models\\'.array_keys($dataoptions)[0] . '::where',$dataoptions[array_keys($dataoptions)[0]],$id);
            $check = $item->get();
            if(sizeof($check) > 0){
                $this->updateCore($item ,$data);
            }else{
                if ($dataoptions[array_keys($dataoptions)[0]] !== "id") {
                    $data[$dataoptions[array_keys($dataoptions)[0]]] = $id;
                }
                $this->createCore(array_keys($dataoptions)[0],$data);
            }
        }

        public function onetomany ($data =[],$dataoptions,$id){
            $arr_key = [];
            foreach ($data as $key) {
                if (isset($key['id'])) {
                    array_push($arr_key, $key['id']);
                }          
            }
            $item = call_user_func('App\Models\\'.array_keys($dataoptions)[0] . '::whereNotIn',$dataoptions["primarykey"],$arr_key)->where($dataoptions[array_keys($dataoptions)[0]],$id)->delete();
            foreach ($data as $data) {
               if(isset($data[$dataoptions["primarykey"]])){
                     $item =  call_user_func('App\Models\\'.array_keys($dataoptions)[0] . '::find',$data[$dataoptions["primarykey"]]); 
                     $this->updateCore ($item, $data); 
               }else{
                    if ($dataoptions[array_keys($dataoptions)[0]] !== "id") {
                        $data[$dataoptions[array_keys($dataoptions)[0]]] = $id;
                    }
                    $this->createCore (array_keys($dataoptions)[0],$data);
               }
            }
        }
    
        public function deletebase($class,$id){
            DB::beginTransaction();
            try {
                $delete =  $this->deleteCore($class,$id);
                if ($delete) {
                    DB::commit();
                    return ['status' => true, 'msg' => 'Delete Successful!'];
                }
                DB::rollback();
                return ['status' => false, 'msg' => 'Delete fail!'];
            } catch (\Exception $e) {
                DB::rollback();
                return Cv::ParseException($e);
            }
        }

        public function baseshow( $class ,$id, $data){
            $item =  call_user_func('App\Models\\'.$class . '::find',$id);
            if (isset($data['options'])) {
                foreach ($data['options'] as $key => $option) {
                    $item = $this->population ($key , $option , $data, $item, $id);
                }
                if( isset($data['options']['readfiles'])){
                    $this->populateContentFile($class,$data['options']['readfiles'],$item);
                }            
            }
            return $item;
        }

       
        function population($key , $options , $data, $item, $id){
            switch ($key) {
                case 'onetoone':
                        foreach ($options as  $value) {
                            $item->{array_keys($value)[0]} = $this->getOne (array_keys($value)[0],$value,$id);
                        }
                    break;
                case 'onetomany':
                        foreach ($options as  $value) {
                            $item->{array_keys($value)[0]} = $this->getMany (array_keys($value)[0],$value,$id);
                        }
                    break;
                case 'manytomany':
                        // foreach ($options as  $value) {
                        //     $item = $this->getManytoMany (array_keys($value)[0],$value,$id);
                        // }
                    break;
            }
            return $item;
        }



        function getDiplayName($string){
            if($string){
                return explode(",",$string);
            } 
            return "*";
        }
        
        function getQueryLike($query,$string,$val){
            if ($string) {
                $field =  explode(",",$string);
                foreach ($field as  $value) {
                    $query->orwhere($value,'LIKE', '%'.$val.'%');
                }
            }        
            return $query;
        }

        function getQueryWhere ($query,$filter) {
            if (sizeof($filter) > 0) {
                foreach ($filter as $filterkey) {
                    if ($filterkey[array_keys($filterkey)[0]] == 'notnull') {
                        $query->whereNotNull(array_keys($filterkey)[0]);
                    }else {
                        $query->where(array_keys($filterkey)[0],'LIKE', '%'.$filterkey[array_keys($filterkey)[0]].'%');
                    }
                }
            }
            return $query;
        }

        public function getTable ($class) {
            return resolve('App\Models\\'.$class)->getTable();
        }

        public function basepaging($class,Request $request,$option=['columnraw'=>[]]){
            $current_page =  $request->get('current_page');
            $rows = $request->get('rows');
            $search = $request->get('search');
            $fieldsearch = $request->get('fieldsearch');
            $fielddisplay = $this->getDiplayName($request->get('fielddisplay'));
            $date = $request->get('date');
            $val = '%'.$search.'%';
            $options = [];
            if ($request->get('options')) {
                $options = $request->get('options');
            }
            
            $query = call_user_func('App\Models\\'.$class . '::where',function($query) use ($val,$fieldsearch) {
                if($fieldsearch){
                    $query = $this->getQueryLike($query,$fieldsearch,$val);
                }
            });
            if (isset($options)) {
                if (isset($options['where']['filter'])) {
                    $query = $this->getQueryWhere($query,$options['where']['filter']);
                } 
            }
            // $query->whereNotNull('emp_id');
            
            // if (sizeof($options['join']) > 0) {
            //     foreach ($options['join'] as $option) {
            //         $field = $this->getDiplayName($option[array_keys($option)[1]]);
            //         $key = $this->getDiplayName($option[array_keys($option)[0]]);
            //         $fieldsearch1 = $option[array_keys($option)[2]];
            //         $query->join($this->getTable(array_keys($option)[0]),$this->getTable($class).'.'.$key[1],$this->getTable(array_keys($option)[0]).'.'.$key[0])->select('*',DB::raw('GROUP_CONCAT('.$this->getTable(array_keys($option)[0]).'.'.$fieldsearch1.') as '.$fieldsearch1))->where($this->getTable(array_keys($option)[0]).'.'.$fieldsearch1,'LIKE', '%'.$val.'%')->groupBy($this->getTable($class).'.'.$key[1]);
            //         $query->with([array_keys($option)[0] => function ($query) use ($field){
            //             $query->select($field);                   
            //         }])->get();
            //     }      
            // }   

            $count = $query->count();
            $sounds = $query->take( $rows )->skip(($current_page-1)*$rows)->get(); 
            return ['data'=> $sounds,'total_rows'=>$count,'page'=>$current_page];
        }

        public function login ($data) {
            if (! $token = auth()->attempt($data)) {
                return response()->json([
                    'status' => 401,
                    'errors' => 'Unauthorized.',
                ], 401);           
            }  

            $user = auth()->user();
            return [
                'status' => 200,
                'message' => 'Authorized.',
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'user' => $user
            ];
            
        }

        public function logout()
        {
            auth()->logout();
            return response()->json([
                'status' => 200,
                'message' => 'Logout Success.',
            ], 200);
        }


        public function forgotPass ($request) {
            $validator = Validator::make(
                $request->only('email'),
                ['email' => 'required|string|email|max:255|exists:users,email'],
                ['exists' => "We couldn't find an account with that email."]
            );

            if ($validator->fails()) {
                return response()->json([
                    'status' => 200,
                    'message' => "Forgot Password Fail!",
                ], 200);
            }

            return response()->json([
                'status' => 200,
                'message' => "Forgot Password Success!",
            ], 200);
            // send email
            // $response = $this->sendResetLinkEmail($request);

            // if ($response) {
            //     return $this->responseSuccess('Email reset link sent.');
            // } else {
            //     return $this->responseServerError();
            // }
        }

        public function resetPass ($request) {
            if (Auth::id()) {
                $user = Users::where('id', Auth::id())->first();
                if ($user) {
                    $request->request->add(['email' => $user->email]);
                }
            }
    
            $validator = Validator::make(
                $request->all(),
                ['password' => 'required|string|max:255|min:6'],
                ['password_new' => 'required|string|max:255|min:6'],
                ['re_password_new' => 'required|string|max:255|min:6'],
            );
            if($request->password_new != $request->re_password_new){
                return response()->json([
                    'status' => 200,
                    'message' => "Nhập lại mật khẩu không đúng!",
                ], 200);
            }
            if ($validator->fails()) {
                return response()->json([
                    'status' => 200,
                    'message' => "Mật khẩu là chuỗi, không rỗng, min 6, max 255!",
                ], 200);
            }
    
            $check = auth()->attempt($this->credentials($request));

            if ($check) {
                
                $result = $user->update(['password'=> Hash::make($request->password_new)]);
                if($result){
                    return response()->json([
                        'status' => 200,
                        'message' => "Change Password Success",
                    ], 200);
                }else {
                    return response()->json([
                        'status' => 200,
                        'message' => "Change Password Fail!",
                    ], 200);
                }
                
            } else {
                return response()->json([
                    'status' => 200,
                    'message' => "Error Change Password!",
                ], 200);
            }
        }

        public function lockScreen ($request) {
            if (Auth::id()) {
                $user = Users::where('id', Auth::id())->first();
                if ($user) {
                    $request->request->add(['email' => $user->email]);
                }
            }

            $check = auth()->attempt($this->credentials($request));
            if ($check) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Lock Screen Success',
                ], 200);   
            } else {
                return response()->json([
                    'status' => 200,
                    'message' => 'Error Password',
                ], 200); 
            }       
        }
        
    }

?>