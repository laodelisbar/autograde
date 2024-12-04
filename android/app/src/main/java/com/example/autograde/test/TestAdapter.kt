package com.example.autograde.test

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.autograde.data.api.response.StartQuestionsItem
import com.example.autograde.databinding.ItemNavNumberBinding

class TestAdapter(
    private val onQuestionClick: (StartQuestionsItem, Int) -> Unit
) : RecyclerView.Adapter<TestAdapter.ViewHolder>() {

    private val questions = mutableListOf<StartQuestionsItem>()

    fun submitList(newQuestions: List<StartQuestionsItem>?) {
        questions.clear()
        newQuestions?.let { questions.addAll(it) }
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemNavNumberBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val question = questions[position]
        holder.bind(question, position)
    }

    override fun getItemCount(): Int = questions.size

    inner class ViewHolder(private val binding: ItemNavNumberBinding) :
        RecyclerView.ViewHolder(binding.root) {


        fun bind(question: StartQuestionsItem, position: Int) {
            binding.tvNumber.text = (position + 1).toString()
            binding.root.setOnClickListener {
                onQuestionClick(question, position)
            }
        }
    }
}
