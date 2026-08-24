<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserController extends Controller
{
    //


    public function index(){
        
        $users = User::all();
        $current_user = Auth::user();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'current_user' => $current_user
        ]);
    }

    public function store(Request $request){

        // dd($request->all());

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string',
            'role' => 'required|string',
            'profile_pic' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        
        $validated['password'] = Hash::make($validated['password']);

        if ($request->hasFile('profile_pic')) {
            $validated['profile_pic'] = $request->file('profile_pic')->store('profile_pics', 'public');
        }

        $user = User::create($validated);

        return redirect()->route('user.index')->with([
            'message' => 'User added successfully!',
            'user' => $user
        ]);

        

    }


    public function edit(User $user){
        return response()->json($user);
    }


    public function update(User $user, Request $request){

        // dd($request->all());

        try{

            $validated = $request->validate([
                'name' => 'string|required',
                'role' => 'string|required',
                'profile_pic' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
            ]);

            if ($request->hasFile('profile_pic')) {

                // delete the old file before storing the new one
                if ($user->profile_pic && Storage::disk('public')->exists($user->profile_pic)) {
                    Storage::disk('public')->delete($user->profile_pic);
                }

                $validated['profile_pic'] = $request->file('profile_pic')->store('profile_pics', 'public');
            }

            // dd($validated);

            $user->update($validated);

            return redirect()->route('user.index')->with([
                'message' => 'User updated successfully!',
                'user' => $user
            ]);

        }catch(Exception $e){
            dd("update function: " . $e);
            return redirect()->back()->with('error', 'Something went wrong: ' . $e);
        }
    }

    //super admin side
    public function updateCredentials(User $user, Request $request){
        
    
        $validated = $request->validate([
            'email' => 'required|string',
            'current_password'      => 'required|string',
            'new_password'          => 'nullable|string|min:8|confirmed',
        ]);

        // Verify current password if match sa user password store in database
        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'The current password is incorrect.',
            ]);
        }

        // Update email
        if (!empty($validated['email'])) {
            $user->email = trim($validated['email']);
        }

        // Update password if provided
        if (!empty($validated['new_password'])) {
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

       return redirect()->back()->with(['success' => 'User Credentials updated!']);
    }


    public function destroy(User $user){

        $user->delete();

        return redirect()->route('user.index')->with('message', 'User removed successfully!');

    }   


    public function login(Request $request){
        $user = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->has('remember');

        if (!Auth::attempt($user, $remember)) {
            throw ValidationException::withMessages([
                'email' => 'Incorrect email or password.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->route('dashboard.index');
    }


    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate(); // destroy session
        $request->session()->regenerateToken();

        return redirect(route('index'));
    }

    public function verifyUserEmail(Request $request){

        // dd($request->all());

        $validated = $request->validate([
            'email' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if(!$user){
            return response()->json(['error' => 'Email does not match to any user, please try again.'], 404);
        }

        return response()->json($user->id);
    }

    //update passsword admin side (main user)
    public function updatePassword(Request $request, User $user)
    {

        // dd($request->all());
       
        // Validate only new password and its confirmation
        $validated = $request->validate([
            'new_password' => 'required|string|min:8|confirmed',
        ], [
            'new_password.confirmed' => 'New password and confirmation do not match.',
            'new_password.required' => 'Please enter a new password.',
            'new_password.min' => 'Password must be at least 8 characters.',
        ]);

        // Save new password
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return redirect()->back()->with(['success' => 'Password updated successfully!']);
    }


   

}
