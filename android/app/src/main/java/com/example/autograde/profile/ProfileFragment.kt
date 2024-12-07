package com.example.autograde.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.bumptech.glide.Glide
import com.example.autograde.databinding.FragmentProfileBinding

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private val profileViewModel: ProfileViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        observeProfile()
        observeError()
    }

    private fun observeProfile() {
        profileViewModel.profileResponse.observe(viewLifecycleOwner) { profile ->
            profile?.let {
                binding.tvEmail.text = it.email ?: "Email tidak tersedia"
                binding.tvUsername.text = it.username ?: "Username tidak tersedia"

                Glide.with(this)
                    .load(it.profilePictureUrl)
                    .into(binding.ivProfilePicture)
            } ?: run {
                Toast.makeText(requireContext(), "Data profil tidak ditemukan", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun observeError() {
        profileViewModel.errorMessage.observe(viewLifecycleOwner) { errorMessage ->
            errorMessage?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}