<?php

namespace App\Exceptions\Custom;

use App\Exceptions\Handler\Traits\ExceptionTrait;
use App\Exceptions\Handler\Traits\HandlerTrait;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvalidPurchaseCode extends Exception
{
	use ExceptionTrait, HandlerTrait;
	
	/**
	 * Report the exception.
	 */
	public function report(): void
	{
		// ??? ????? ?? ???
		logger()->warning($this->getMessage());
	}
	
	/**
	 * Render the exception into an HTTP response.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
	 */
	public function render(Request $request): Response|JsonResponse
	{
		$message = $this->getMessage() ?: 'Invalid purchase code.';

		// ??? ??????? API ?? AJAX ????
		if ($request->expectsJson() || $request->ajax()) {
			return response()->json([
				'success' => false,
				'message' => $message,
				'status'  => 401,
			], 401);
		}

		// ???? ??????? ??? HTML ???? ????? ???
		$viewMessage = '<div class="text-center text-danger">' . e($message) . '</div>';

		// ?? ??? ???? responseCustomError ??????? ???????
		return $this->responseCustomError($this, $request, $viewMessage, 401);
	}
}