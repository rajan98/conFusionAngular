import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    flyInOut(),
    expand(),
    visibility()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  dishcopy: Dish;
  visibility = 'shown';

  comment: Comment;
  commentForm: FormGroup;
  @ViewChild('commform', { static: false }) commentFormDirective;
  formErrors = {
    comment: '',
    author: ''
  };
  validationMessages = {
    comment: {
      required: 'Comment is required',
    },
    author: {
      required: 'Author Name is required.',
      minlength: 'Author Name must be at least 2 characters long.',
      maxlength: 'Name cannot be more than 25 characters long.'
    }
  }

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }
  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: [5],
      comment: ['', [Validators.required]],
      author: ['', [Validators.required, , Validators.minLength(2), Validators.maxLength(25)]]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    if (this.commentForm.touched && this.commentForm.valid) {
      this.comment = this.commentForm.value;
    } else {
      this.comment = null;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    const d = new Date();
    const n = d.toISOString();
    this.comment.rating = this.commentForm.get('rating').value;
    this.comment.author = this.commentForm.get('author').value;
    this.comment.comment = this.commentForm.get('comment').value;
    this.comment.date = n;
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    console.log(this.comment);
    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: ''
    });
    this.commentFormDirective.resetForm();
  }

}
