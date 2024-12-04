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

    private var enabledBackground: Drawable? = null
    private var disabledBackground: Drawable? = null
    private var warningBackground: Drawable? = null

    private var enabledTextColor: Int = 0
    private var disabledTextColor: Int = 0
    private var warningTextColor: Int = 0

    private var isWarning: Boolean = false

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
        when {
            isWarning -> {
                background = warningBackground
                setTextColor(warningTextColor)
            }
            isEnabled -> {
                background = enabledBackground
                setTextColor(enabledTextColor)
            }
            else -> {
                background = disabledBackground
                setTextColor(disabledTextColor)
            }
        }
    }

    override fun onDraw(canvas: Canvas) {
        if (!isInEditMode) {
            updateTextViewAppearance()
        }
        super.onDraw(canvas)
    }

    override fun onClick(v: View?) {
        // Logika klik
        if (isEnabled) {
            // Lakukan aksi yang sesuai di sini, misalnya ganti status atau navigasi
        }
    }
}
