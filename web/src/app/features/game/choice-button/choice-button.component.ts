import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgClass } from '@angular/common'

@Component({
    selector: 'app-choice-button',
    standalone: true,
    imports: [NgClass],
    template: `
        <button
            [disabled]="isAnswered"
            (click)="onSelect()"
            [ngClass]="buttonClasses()"
            class="w-full border-2 rounded-xl py-4 px-3 text-lg myanmar-text font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1"
        >
            {{ choice }}
        </button>
    `,
})
export class ChoiceButtonComponent {
    @Input({ required: true }) choice = ''
    @Input({ required: true }) isAnswered = false
    @Input({ required: true }) correctAnswer = ''
    @Input() selectedChoice: string | null = null
    @Output() selected = new EventEmitter<string>()

    onSelect(): void {
        if (!this.isAnswered) {
            this.selected.emit(this.choice)
        }
    }

    buttonClasses(): Record<string, boolean> {
        const isSelected = this.selectedChoice === this.choice
        const isCorrect = this.choice === this.correctAnswer

        if (!this.isAnswered) {
            return {
                'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50 cursor-pointer active:scale-95': true,
                'text-slate-700': true,
            }
        }

        if (isSelected && isCorrect) {
            return {
                'bg-green-100 border-green-500 text-green-800 cursor-default': true,
            }
        }

        if (isSelected && !isCorrect) {
            return {
                'bg-red-100 border-red-500 text-red-800 cursor-default animate-shake': true,
            }
        }

        if (!isSelected && isCorrect) {
            return {
                'bg-green-50 border-green-400 text-green-700 cursor-default': true,
            }
        }

        return {
            'bg-white border-slate-100 text-slate-400 cursor-default': true,
        }
    }
}
