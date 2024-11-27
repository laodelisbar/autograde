package com.example.autograde

import android.content.Context
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.util.AttributeSet
import android.view.View
import androidx.appcompat.widget.AppCompatTextView
import androidx.core.content.ContextCompat

class TextViewCustom @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : AppCompatTextView(context, attrs), View.OnClickListener {

    // Background untuk tiga kondisi
    private var enabledBackground: Drawable? = null
    private var disabledBackground: Drawable? = null
    private var warningBackground: Drawable? = null

    // Warna teks untuk tiga kondisi
    private var enabledTextColor: Int = 0
    private var disabledTextColor: Int = 0
    private var warningTextColor: Int = 0

    private var isWarning: Boolean = false // Status warning

    init {

        // Inisialisasi drawable dan warna teks
        enabledBackground = ContextCompat.getDrawable(context, R.drawable.bg_nav_number_active)
        disabledBackground = ContextCompat.getDrawable(context, R.drawable.bg_nav_number_inactive)
        warningBackground = ContextCompat.getDrawable(context, R.drawable.bg_nav_number_warning)

        enabledTextColor = ContextCompat.getColor(context, android.R.color.white)
        disabledTextColor = ContextCompat.getColor(context, android.R.color.black)
        warningTextColor = ContextCompat.getColor(context, android.R.color.black)

        // Set kondisi awal
        updateTextViewAppearance()

        // Jadikan TextView clickable
        isClickable = true
        isFocusable = true
        setOnClickListener(this)
    }

    // Fungsi untuk mengatur status warning
    fun setWarning(isWarning: Boolean) {
        this.isWarning = isWarning
        updateTextViewAppearance()
    }

    override fun setEnabled(enabled: Boolean) {
        super.setEnabled(enabled)
        updateTextViewAppearance()
    }

    private fun updateTextViewAppearance() {
        // Perbarui tampilan berdasarkan kondisi
        if (isWarning) {
            background = warningBackground
            setTextColor(warningTextColor)
        } else if (isEnabled) {
            background = enabledBackground
            setTextColor(enabledTextColor)
        } else {
            background = disabledBackground
            setTextColor(disabledTextColor)
        }
    }

    override fun onDraw(canvas: Canvas) {
        if (!isInEditMode) {
            updateTextViewAppearance()
        }
        super.onDraw(canvas)
    }

    override fun onClick(v: View?) {
        // Logika klik (sesuaikan dengan kebutuhan)
        if (isEnabled) {
            performClick() // Eksekusi aksi klik default
        }
    }
}
