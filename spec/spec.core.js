
describe 'Class'
  describe '()'
    it 'should create a class'
      User = Class()
      User.should.be_type 'function'
    end
  end
  
  describe '.extend()'
    it 'should create a class'
      User = Class.extend()
      User.should.be_type 'function'
    end
  end
  
  describe '({ ... })'
    it 'should populate prototype properties'
      User = Class({ type: 'user' })
      (new User).type.should.eql 'user'
    end
    
    it 'should populate prototype methods'
      User = Class({ toString: function(){ return 'test' }})
      (new User).toString().should.eql 'test'
    end
    
    it 'should initialize with the "init" method'
      User = Class({
        init: function(name) {
          this.name = name
        }
      })
      (new User('tj')).name.should.eql 'tj'
    end
    
    it 'should call the "init" method only once per initialization'
      init = function(){}
      User = Class({ init: init })
      User.prototype.should.receive('init', 'once').with_args('tj')
      new User('tj')
    end
    
    it 'should inherit properties of the super class'
      User = Class({ type: 'user' })
      Admin = User.extend()
      (new Admin).type.should.eql 'user'
    end

    it 'should work when using the instanceof operator'
      User = Class({ type: 'user' })
      Admin = User.extend()
      (new User).should.be_an_instance_of User
      (new Admin).should.be_an_instance_of Admin
    end

    it 'should access the superclass via __super__'
      User = Class({
        init: function(name) {
          this.name = name
        }
      })

      Admin = User.extend({
        init: function(name) {
          this.__super__(name)
        }  
      })

      (new Admin('tj')).name.should.eql 'tj'
    end

    it 'should allow a subclass to override methods'
      User = Class({
        init: function(name) {
          this.name = name
        }
      })

      Admin = User.extend({
        init: function(name) {
          this.name = '<' + name + '>'
        }  
      })

      (new Admin('tj')).name.should.eql '<tj>'
    end

    it 'should allow multiple inheritance'
      User = Class({
        init: function(name) {
          this.name = name
        },

        toString: function() {
          return this.name
        }
      })

      Manager = User.extend({
        init: function(name) {
          this.__super__(name)
          this.type = 'Manager'
        },

        toString: function() {
          return this.__super__() + ' is a ' + this.type
        }
      })

      Admin = Manager.extend({
        init: function(name) {
          this.__super__(name)
          this.type = 'Admin'
        }
      })

      (new User('tj')).toString().should.eql 'tj'
      (new Manager('tj')).toString().should.eql 'tj is a Manager'
      (new Admin('tj')).toString().should.eql 'tj is a Admin'
    end
  end
end