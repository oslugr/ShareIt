// FileWriter polyfill based on code from idb.filesystem.js by Eric Bidelman

/**
 * Interface to writing a Blob/File.
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/file-writer.html#the-filewriter-interface
 *
 * @param {FileEntry} fileEntry The FileEntry associated with this writer.
 * @constructor
 */
function FileWriter(blob)
{
  var position_ = 0;
  var length_ = blob.size;
  var blob_ = blob;

  this.__defineGetter__('position', function()
  {
    return position_;
  });

  this.__defineGetter__('length', function()
  {
    return length_;
  });

  this.write = function(data)
  {
    if(!blob)
      throw Error('Expected blob argument to write.');

    // Call onwritestart if it was defined.
    if(this.onwritestart)
      this.onwritestart();

    // Calc the fragments
    var head = blob_.slice(0, position_)
    var padding = position_-head.size
    if(padding < 0)
        padding = 0;
    var stop = position_+data.size

    // Do the "write" --in fact, a full overwrite of the Blob
    blob_ = new Blob([head, ArrayBuffer(padding), data, blob_.slice(stop)],
                     {"type": blob_.type})

    // Set writer.position == write.length.
    position_ += data.size;
    length_ = blob_.size;

    if(self.onwriteend)
      self.onwriteend();
  };
}

FileWriter.prototype =
{
  seek: function(offset)
  {
    this.position_ = offset

    if(this.position_ > this.length_)
      this.position_ = this.length_
    else if(this.position_ < 0)
      this.position_ += this.length_

    if(this.position_ < 0)
      this.position_ = 0
  },
  truncate: function(size)
  {
    var blob;

    if(size < this.length_)
      blob = this.fileEntry_.file_.blob_.slice(size)
    else
      blob = new Blob([this.fileEntry_.file_.blob_,
                       ArrayBuffer(size - this.length_)])

    this.write(blob)
  }
}