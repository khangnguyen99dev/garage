<?php
use Carbon\Carbon;
	/**
	 * Mở composer.json
	 * Thêm vào trong "autoload" chuỗi sau
	 * "files" : [
	 *  	"app/function/function.php"
	 *	]
	 * Chạy cmd composer dumpautoload
	 */
	function utf8convert($str) {
        if(!$str) return false;
        $utf8 = array(
		    'a'=>'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
		    'd'=>'đ|Đ',
		    'e'=>'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
		    'i'=>'í|ì|ỉ|ĩ|ị|Í|Ì|Ỉ|Ĩ|Ị',
		    'o'=>'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
		    'u'=>'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
		    'y'=>'ý|ỳ|ỷ|ỹ|ỵ|Ý|Ỳ|Ỷ|Ỹ|Ỵ',
		);
        foreach($utf8 as $ascii=>$uni) $str = preg_replace("/($uni)/i",$ascii,$str);
			return $str;
	}
	
	function utf8tourl($text){
        $text = strtolower(utf8convert($text));
        $text = str_replace( "ß", "ss", $text);
        $text = str_replace( "%", "", $text);
        $text = preg_replace("/[^_a-zA-Z0-9 -] /", "",$text);
        $text = str_replace(array('%20', ' '), '-', $text);
        $text = str_replace("----","-",$text);
        $text = str_replace("---","-",$text);
        $text = str_replace("--","-",$text);
        $text = str_replace("?","",$text);
		return $text;
	}

    function generateRandomString($length) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

	function getDisplayName($string){
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

    function responseSuccess($message = 'Thành công!')
    {
        return response()->json([
            'status' => 200,
            'message' => $message,
        ], 200);
    }

	function responseSuccessWithData($message = 'Thành công!', $data)
    {
        return response()->json([
            'status' => 200,
            'message' => $message,
			'data' => $data,
        ], 200);
    }

	function responseCreated($message = 'Đã tạo thành công.')
    {
        return response()->json([
            'status' => 201,
            'message' => $message,
        ], 201);
    }

	function responseServerError($errors = 'Lỗi máy chủ!')
    {
        return response()->json([
            'status' => 500,
            'errors' => $errors
        ], 500);
    }

    function getDateAttribute($value)
	{
    	return Carbon::parse($value)->format('Y-m-d\TH:i');
	}

    function responseUnauthorized($errors = ['Lỗi xác thực'])
    {
        return response()->json([
            'status' => 401,
            'errors' => $errors,
        ], 401);
    }
?>